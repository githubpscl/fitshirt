import { handleMatch } from '../lib/handlers.js';

export default async function handler(req, res) {
  await handleMatch(req, res);
}
