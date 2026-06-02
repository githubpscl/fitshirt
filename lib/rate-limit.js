// Lightweight in-memory rate limiter. Per-process — fine for low-traffic MVP.
// On Vercel each warm function instance has its own counter; cold starts reset.
// For real abuse protection swap in Upstash Ratelimit (also has a free tier).

const buckets = new Map(); // key -> { count, resetAt }

function clientKey(req) {
  // Vercel sets x-forwarded-for; fall back to socket address.
  const xff = req.headers?.['x-forwarded-for'] || '';
  const ip = String(xff).split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  return ip;
}

export function rateLimit(req, res, { windowMs = 60_000, max = 10, name = 'default' } = {}) {
  const key = `${name}:${clientKey(req)}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) {
    const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    if (res && !res.headersSent) {
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(429).json({
        error: 'Zu viele Anfragen. Bitte einen Moment warten und nochmal versuchen.',
        retryAfter: retryAfterSec,
      });
    }
    return false;
  }
  entry.count += 1;
  return true;
}

// Periodic cleanup of expired buckets (only meaningful for the dev server).
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets.entries()) {
      if (v.resetAt < now) buckets.delete(k);
    }
  }, 5 * 60_000).unref?.();
}
