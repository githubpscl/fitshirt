// Local development server. Mirrors the /api routes used on Vercel so the
// frontend can hit /api/* in dev exactly like in production.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  handleMatch,
  handleCreateOrder,
  handleGetOrder,
  handleListOrders,
  handlePatterns,
  handleInventory,
} from './lib/handlers.js';
import { listOrders } from './lib/db.js';
import { requireAdmin } from './lib/auth.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '256kb' }));

// Vercel handlers expect req.query and req.headers (Node http-style) which
// express provides natively. They expect res.status().json()/.send() which
// express also has.

app.post('/api/match', (req, res) => handleMatch(req, res));
app.post('/api/order', (req, res) => handleCreateOrder(req, res));
app.get('/api/orders', (req, res) => handleListOrders(req, res));
app.get('/api/orders/:id', (req, res) => {
  req.query.id = req.params.id;
  return handleGetOrder(req, res, req.params.id);
});
app.patch('/api/orders/:id', (req, res) => {
  req.query.id = req.params.id;
  return handleGetOrder(req, res, req.params.id);
});
app.get('/api/patterns', (req, res) => handlePatterns(req, res));
app.get('/api/inventory', (req, res) => handleInventory(req, res));

app.get('/api/orders-export', async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const orders = await listOrders({});
  const cols = ['id','createdAt','status','patternId','color','firstName','lastName','email'];
  const lines = [cols.join(',')];
  for (const o of orders) {
    lines.push([o.id, o.createdAt, o.status, o.patternId, o.color,
      o.customer.firstName, o.customer.lastName, o.customer.email].join(','));
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="fitshirt-orders.csv"');
  res.send(lines.join('\n'));
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`[dev-api] http://localhost:${port}`);
});
