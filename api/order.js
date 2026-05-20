import { handleCreateOrder } from '../lib/handlers.js';

export default async function handler(req, res) {
  await handleCreateOrder(req, res);
}
