import { handleListOrders } from '../../lib/handlers.js';

export default async function handler(req, res) {
  await handleListOrders(req, res);
}
