// Admin auth: compares the X-Admin-Password header against ADMIN_PASSWORD.
// If ADMIN_PASSWORD is unset, falls back to "admin123" (MVP default) and
// logs a warning once per process.

let warned = false;

function expectedPassword() {
  const fromEnv = process.env.ADMIN_PASSWORD;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  if (!warned) {
    // eslint-disable-next-line no-console
    console.warn('[auth] ADMIN_PASSWORD env var not set - using MVP default "admin123". Set it in Vercel project settings.');
    warned = true;
  }
  return 'admin123';
}

// Constant-time comparison to defeat timing attacks. Negligible at this
// scale but free to do right.
function safeEqual(a, b) {
  const ab = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  if (ab.length !== bb.length) return false;
  let mismatch = 0;
  for (let i = 0; i < ab.length; i += 1) mismatch |= ab[i] ^ bb[i];
  return mismatch === 0;
}

export function isAdmin(req) {
  const header = req.headers['x-admin-password'] || req.headers['X-Admin-Password'];
  return safeEqual(header, expectedPassword());
}

export function requireAdmin(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return false;
  }
  return true;
}
