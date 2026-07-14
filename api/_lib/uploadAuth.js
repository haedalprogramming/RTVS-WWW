// Shared password-gate helpers for the internal Shorts upload tool (/upload.html).
// Stateless session: the cookie carries a signed expiry timestamp instead of a
// server-side session store, since Vercel functions don't share memory across invocations.

const crypto = require('crypto');

const COOKIE_NAME = 'upload_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSessionSecret() {
  const secret = process.env.UPLOAD_SESSION_SECRET;
  if (!secret) throw new Error('UPLOAD_SESSION_SECRET is not configured');
  return secret;
}

function sign(payload) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
}

function createSessionToken() {
  const payload = String(Date.now() + SESSION_TTL_MS);
  return `${payload}.${sign(payload)}`;
}

function isValidSessionToken(token) {
  if (!token || typeof token !== 'string') return false;
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return false;
  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const expectedBuf = Buffer.from(sign(payload));
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
    return false;
  }

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

// Constant-time password check regardless of input length, so failed attempts
// can't be timed to learn the real password's length.
function passwordMatches(candidate, expected) {
  if (typeof candidate !== 'string') return false;
  const candidateHash = crypto.createHash('sha256').update(candidate).digest();
  const expectedHash = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(candidateHash, expectedHash);
}

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const eq = part.indexOf('=');
    if (eq === -1) return acc;
    acc[part.slice(0, eq).trim()] = decodeURIComponent(part.slice(eq + 1).trim());
    return acc;
  }, {});
}

function hasValidSession(req) {
  return isValidSessionToken(parseCookies(req)[COOKIE_NAME]);
}

function setSessionCookie(res) {
  const maxAgeSeconds = Math.floor(SESSION_TTL_MS / 1000);
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${createSessionToken()}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}`
  );
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
}

// Call at the top of any upload-related API handler. Returns false (and has
// already sent a 401) if the request has no valid session.
function requireSession(req, res) {
  if (!hasValidSession(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

module.exports = {
  passwordMatches,
  hasValidSession,
  setSessionCookie,
  clearSessionCookie,
  requireSession,
};
