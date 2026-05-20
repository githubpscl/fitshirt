import { handlePatterns } from '../lib/handlers.js';

export default async function handler(req, res) {
  await handlePatterns(req, res);
}
