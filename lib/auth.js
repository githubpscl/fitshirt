// Trivial admin auth for MVP. Password lives in env (or default "admin123").

export function isAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD || 'admin123';
  const header = req.headers['x-admin-password'] || req.headers['X-Admin-Password'];
  return header === expected;
}

export function requireAdmin(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return false;
  }
  return true;
}
