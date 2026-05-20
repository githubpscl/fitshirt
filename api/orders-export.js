import { listOrders } from '../lib/db.js';
import { requireAdmin } from '../lib/auth.js';

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  if (!requireAdmin(req, res)) return;
  const orders = await listOrders({});
  const cols = [
    'id', 'createdAt', 'status', 'patternId', 'patternName', 'fitGroup', 'color',
    'sleeveType', 'neckType', 'lengthPreference', 'firstName', 'lastName',
    'email', 'address', 'price', 'matchScore', 'chest', 'shoulder', 'upperArm',
    'armLength', 'backLength', 'waist', 'neckWidth',
  ];
  const lines = [cols.join(',')];
  for (const o of orders) {
    const m = o.shirtMeasurements || {};
    lines.push([
      o.id, o.createdAt, o.status, o.patternId, o.patternName, o.fitGroup, o.color,
      o.sleeveType, o.neckType, o.lengthPreference,
      o.customer.firstName, o.customer.lastName, o.customer.email, o.customer.address,
      o.price, o.matchScore,
      m.chest, m.shoulder, m.upperArm, m.armLength, m.backLength, m.waist, m.neckWidth,
    ].map(csvEscape).join(','));
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="fitshirt-orders.csv"');
  res.status(200).send(lines.join('\n'));
}
