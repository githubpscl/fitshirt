// Pure request handlers used both by Vercel serverless functions (under /api)
// and the local Express dev server. Each handler takes (req, res) where req
// has a parsed JSON body and matching query/params/headers.

import { findMatch, loadPatterns } from './matcher.js';
import { createOrder, getOrder, listOrders, updateOrderStatus, inventoryByPattern } from './db.js';
import { requireAdmin } from './auth.js';

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
  try {
    const body = await readJsonBody(req);
    const { measurements, fitPreference, sleeveType, neckType, lengthPreference } = body;
    if (!measurements || !fitPreference) {
      res.status(400).json({ error: 'measurements und fitPreference sind Pflicht' });
      return;
    }
    const result = await findMatch({ measurements, fitPreference, sleeveType, lengthPreference });
    res.status(200).json({ ...result, neckType });
  } catch (err) {
    console.error('match error:', err);
    res.status(500).json({ error: 'matching fehlgeschlagen', detail: String(err.message || err) });
  }
}

export async function handleCreateOrder(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  try {
    const body = await readJsonBody(req);
    const { patternId, color, customer, measurements, shirtMeasurements } = body;
    if (!patternId || !color || !customer || !customer.email) {
      res.status(400).json({ error: 'Pflichtfelder fehlen' });
      return;
    }
    const order = await createOrder({
      patternId,
      patternName: body.patternName,
      fitGroup: body.fitGroup,
      color,
      sleeveType: body.sleeveType,
      neckType: body.neckType,
      lengthPreference: body.lengthPreference,
      measurements: measurements || {},
      shirtMeasurements: shirtMeasurements || {},
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        address: customer.address,
      },
      price: body.price || 65,
      matchScore: body.matchScore,
    });
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
