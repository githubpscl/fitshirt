// Database module: uses Turso (libsql cloud) in production, or a local SQLite
// file when TURSO_DATABASE_URL is not provided. Auto-creates the orders table
// on first call.

import { createClient } from '@libsql/client';

let clientCache = null;
let initPromise = null;

function buildClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url) {
    return createClient({ url, authToken });
  }
  // Local fallback file (good for dev). On Vercel /tmp is the only writable
  // directory; without TURSO_DATABASE_URL the DB will not persist there.
  const fallback = process.env.VERCEL ? 'file:/tmp/local.db' : 'file:local.db';
  return createClient({ url: fallback });
}

async function ensureSchema(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'neu',
      pattern_id TEXT,
      pattern_name TEXT,
      fit_group TEXT,
      color TEXT NOT NULL,
      sleeve_type TEXT,
      neck_type TEXT,
      length_preference TEXT,
      measurements TEXT NOT NULL,
      shirt_measurements TEXT NOT NULL,
      customer_first_name TEXT NOT NULL,
      customer_last_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      price_eur REAL NOT NULL,
      match_score REAL,
      production_type TEXT NOT NULL DEFAULT 'match'
    )
  `);
  // Backwards-compatible migration for DBs created before production_type existed.
  try {
    await client.execute(`ALTER TABLE orders ADD COLUMN production_type TEXT NOT NULL DEFAULT 'match'`);
  } catch (err) {
    // Column already exists or other dialects — ignore.
    if (!String(err.message || err).match(/duplicate column|already exists/i)) {
      // not a duplicate-column error, log but don't fail startup
      console.warn('[db] migration warning:', err.message || err);
    }
  }
}

export async function getDb() {
  if (clientCache) return clientCache;
  clientCache = buildClient();
  if (!initPromise) {
    initPromise = ensureSchema(clientCache).catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  await initPromise;
  return clientCache;
}

export function generateOrderId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${y}${m}${d}-${rand}`;
}

export async function createOrder(payload) {
  const db = await getDb();
  const id = generateOrderId();
  const createdAt = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO orders (
      id, created_at, status, pattern_id, pattern_name, fit_group, color,
      sleeve_type, neck_type, length_preference, measurements, shirt_measurements,
      customer_first_name, customer_last_name, customer_email, shipping_address,
      price_eur, match_score, production_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      createdAt,
      'neu',
      payload.patternId || 'MTM-CUSTOM',
      payload.patternName || null,
      payload.fitGroup || null,
      payload.color,
      payload.sleeveType || null,
      payload.neckType || null,
      payload.lengthPreference || null,
      JSON.stringify(payload.measurements || {}),
      JSON.stringify(payload.shirtMeasurements || {}),
      payload.customer.firstName,
      payload.customer.lastName,
      payload.customer.email,
      payload.customer.address,
      payload.price || 65,
      payload.matchScore || null,
      payload.productionType || 'match',
    ],
  });

  return { id, createdAt, status: 'neu' };
}

function rowToOrder(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    productionType: row.production_type || 'match',
    patternId: row.pattern_id === 'MTM-CUSTOM' ? null : row.pattern_id,
    patternName: row.pattern_name,
    fitGroup: row.fit_group,
    color: row.color,
    sleeveType: row.sleeve_type,
    neckType: row.neck_type,
    lengthPreference: row.length_preference,
    measurements: safeParse(row.measurements),
    shirtMeasurements: safeParse(row.shirt_measurements),
    customer: {
      firstName: row.customer_first_name,
      lastName: row.customer_last_name,
      email: row.customer_email,
      address: row.shipping_address,
    },
    price: row.price_eur,
    matchScore: row.match_score,
  };
}

function safeParse(json) {
  if (!json) return {};
  try { return JSON.parse(json); } catch { return {}; }
}

export async function getOrder(id) {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM orders WHERE id = ?',
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return rowToOrder(result.rows[0]);
}

export async function listOrders({ status } = {}) {
  const db = await getDb();
  const sql = status
    ? 'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC'
    : 'SELECT * FROM orders ORDER BY created_at DESC';
  const args = status ? [status] : [];
  const result = await db.execute({ sql, args });
  return result.rows.map(rowToOrder);
}

export async function updateOrderStatus(id, status) {
  const db = await getDb();
  const result = await db.execute({
    sql: 'UPDATE orders SET status = ? WHERE id = ?',
    args: [status, id],
  });
  return result.rowsAffected > 0;
}

export async function inventoryByPattern() {
  const db = await getDb();
  const result = await db.execute(
    `SELECT pattern_id, COUNT(*) as orders FROM orders GROUP BY pattern_id ORDER BY orders DESC`,
  );
  return result.rows.map((r) => ({ patternId: r.pattern_id, orders: Number(r.orders) }));
}
