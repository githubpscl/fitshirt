// Pure request handlers used both by Vercel serverless functions (under /api)
// and the local Express dev server. Each handler takes (req, res) where req
// has a parsed JSON body and matching query/params/headers.

import { findMatch, computeMtm, loadPatterns } from './matcher.js';
import { createOrder, getOrder, listOrders, updateOrderStatus, inventoryByPattern } from './db.js';
import { requireAdmin } from './auth.js';
import { rateLimit } from './rate-limit.js';
import { sendOrderEmails } from './email.js';

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

export async function handleMatch(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  if (!rateLimit(req, res, { name: 'match', max: 30, windowMs: 60_000 })) return;
  try {
    const body = await readJsonBody(req);
    const { measurements, fitPreference, sleeveType, neckType, lengthPreference } = body;
    if (!measurements || !fitPreference) {
      res.status(400).json({ error: 'measurements und fitPreference sind Pflicht' });
      return;
    }
    const result = await findMatch({ measurements, fitPreference, sleeveType, lengthPreference });
    const mtm = computeMtm({ measurements, fitPreference, sleeveType, lengthPreference });
    res.status(200).json({ ...result, neckType, mtm });
  } catch (err) {
    console.error('match error:', err);
    res.status(500).json({ error: 'matching fehlgeschlagen', detail: String(err.message || err) });
  }
}

// Email validation — simple but blocks obvious junk and bot scrawls.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeStr(v, max = 200) {
  if (v == null) return '';
  return String(v).trim().slice(0, max);
}

export async function handleCreateOrder(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  // Tighter limit on order creation — 5 per minute per IP.
  if (!rateLimit(req, res, { name: 'order', max: 5, windowMs: 60_000 })) return;
  try {
    const body = await readJsonBody(req);
    const { patternId, color, customer, measurements, shirtMeasurements, productionType } = body;
    // For Smart Match a patternId is required; for MTM it's optional.
    const isMtm = productionType === 'mtm';
    if (!color || !customer || !customer.email || (!isMtm && !patternId)) {
      res.status(400).json({ error: 'Pflichtfelder fehlen' });
      return;
    }
    // Honeypot field — bots typically fill it; humans never see it.
    if (body.website) {
      // pretend success to not give scrapers signal
      res.status(201).json({ orderId: 'ORD-HP-0000', status: 'neu' });
      return;
    }
    const cleanCustomer = {
      firstName: sanitizeStr(customer.firstName, 80),
      lastName: sanitizeStr(customer.lastName, 80),
      email: sanitizeStr(customer.email, 160).toLowerCase(),
      address: sanitizeStr(customer.address, 500),
    };
    if (!EMAIL_RE.test(cleanCustomer.email)) {
      res.status(400).json({ error: 'Bitte eine gueltige E-Mail-Adresse angeben.' });
      return;
    }
    if (!cleanCustomer.firstName || !cleanCustomer.lastName || !cleanCustomer.address) {
      res.status(400).json({ error: 'Vorname, Nachname und Lieferadresse sind Pflicht.' });
      return;
    }
    const order = await createOrder({
      productionType: isMtm ? 'mtm' : 'match',
      patternId: isMtm ? null : patternId,
      patternName: body.patternName,
      fitGroup: body.fitGroup,
      color,
      sleeveType: body.sleeveType,
      neckType: body.neckType,
      lengthPreference: body.lengthPreference,
      measurements: measurements || {},
      shirtMeasurements: shirtMeasurements || {},
      customer: cleanCustomer,
      price: body.price || (isMtm ? 129 : 65),
      matchScore: body.matchScore,
    });

    // Fire confirmation + admin notification mails. Failures are logged but
    // don't break the order — the order is already safely in the DB.
    sendOrderEmails({
      id: order.id,
      productionType: isMtm ? 'mtm' : 'match',
      patternId: isMtm ? null : patternId,
      patternName: body.patternName,
      fitGroup: body.fitGroup,
      color,
      sleeveType: body.sleeveType,
      neckType: body.neckType,
      shirtMeasurements: shirtMeasurements || {},
      customer: cleanCustomer,
    }).catch((err) => console.warn('[email] send failed:', err.message || err));

    res.status(201).json({ orderId: order.id, status: order.status, createdAt: order.createdAt });
  } catch (err) {
    console.error('order error:', err);
    res.status(500).json({ error: 'Bestellung konnte nicht gespeichert werden', detail: String(err.message || err) });
  }
}

export async function handleGetOrder(req, res, id) {
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  try {
    if (req.method === 'PATCH') {
      if (!requireAdmin(req, res)) return;
      const body = await readJsonBody(req);
      if (!body.status) {
        res.status(400).json({ error: 'status fehlt' });
        return;
      }
      const ok = await updateOrderStatus(id, body.status);
      if (!ok) {
        res.status(404).json({ error: 'order nicht gefunden' });
        return;
      }
      res.status(200).json({ id, status: body.status });
      return;
    }
    const order = await getOrder(id);
    if (!order) {
      res.status(404).json({ error: 'order nicht gefunden' });
      return;
    }
    // Sensitive admin fields filtered for public GET (no auth header)
    if (!req.headers['x-admin-password']) {
      delete order.customer.address;
    }
    res.status(200).json(order);
  } catch (err) {
    console.error('get order error:', err);
    res.status(500).json({ error: 'fehler', detail: String(err.message || err) });
  }
}

export async function handleListOrders(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  if (!requireAdmin(req, res)) return;
  try {
    const status = req.query?.status;
    const orders = await listOrders({ status: status && status !== 'all' ? status : undefined });
    res.status(200).json({ orders });
  } catch (err) {
    console.error('list orders error:', err);
    res.status(500).json({ error: 'fehler', detail: String(err.message || err) });
  }
}

export async function handlePatterns(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  try {
    const patterns = await loadPatterns();
    res.status(200).json({ patterns });
  } catch (err) {
    res.status(500).json({ error: 'fehler', detail: String(err.message || err) });
  }
}

export async function handleInventory(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  if (!requireAdmin(req, res)) return;
  try {
    const patterns = await loadPatterns();
    const counts = await inventoryByPattern();
    const countMap = Object.fromEntries(counts.map((c) => [c.patternId, c.orders]));
    const inventory = patterns.map((p) => ({
      patternId: p.id,
      name: p.name,
      fitGroup: p.fitGroup,
      ordersTotal: countMap[p.id] || 0,
    }));
    res.status(200).json({ inventory });
  } catch (err) {
    res.status(500).json({ error: 'fehler', detail: String(err.message || err) });
  }
}
