// Password gate for the internal Shorts upload tool (/upload.html).
// GET  -> { authenticated: boolean }, used by the page on load to decide which view to show.
// POST -> { password } in the body; on match, sets the upload_session cookie.
// Requires UPLOAD_PAGE_PASSWORD and UPLOAD_SESSION_SECRET environment variables.

const { passwordMatches, hasValidSession, setSessionCookie } = require('./_lib/uploadAuth');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ authenticated: hasValidSession(req) });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expected = process.env.UPLOAD_PAGE_PASSWORD;
  if (!expected) {
    console.error('UPLOAD_PAGE_PASSWORD is not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { password } = req.body || {};
  if (!passwordMatches(password, expected)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  setSessionCookie(res);
  return res.status(200).json({ ok: true });
};
