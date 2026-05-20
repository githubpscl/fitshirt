import { handleGetOrder } from '../../lib/handlers.js';

export default async function handler(req, res) {
  const id = req.query?.id;
  if (!id) {
    res.status(400).json({ error: 'id fehlt' });
    return;
  }
  await handleGetOrder(req, res, id);
}
