const crypto = require('crypto');

// Not a login system: a single shared secret (ADMIN_KEY) checked on every admin request.
// If ADMIN_KEY is not set, the admin API is switched off completely.
const MAX_FAILS = 10;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map(); // ip -> { count, resetAt }

const digest = (v) => crypto.createHash('sha256').update(String(v)).digest();

module.exports = function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) {
    return res.status(503).json({ message: 'Admin panel is disabled. Set ADMIN_KEY on the server to enable it.' });
  }

  const now = Date.now();
  if (attempts.size > 1000) for (const [ip, r] of attempts) if (r.resetAt <= now) attempts.delete(ip);

  const rec = attempts.get(req.ip);
  const active = rec && rec.resetAt > now ? rec : null;
  if (active && active.count >= MAX_FAILS) {
    return res.status(429).json({ message: 'Too many failed attempts. Try again in a few minutes.' });
  }

  const provided = req.get('x-admin-key') || '';
  if (crypto.timingSafeEqual(digest(provided), digest(expected))) {
    attempts.delete(req.ip);
    return next();
  }

  const record = active || { count: 0, resetAt: now + WINDOW_MS };
  record.count += 1;
  attempts.set(req.ip, record);
  return res.status(401).json({ message: 'Invalid admin key.' });
};
