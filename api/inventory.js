import { handleInventory } from '../lib/handlers.js';

export default async function handler(req, res) {
  await handleInventory(req, res);
}
