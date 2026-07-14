// One-time setup helper (M2): redirects the channel owner to Google's OAuth
// consent screen so we can capture a refresh_token for video upload +
// captions. Gated behind the upload_session cookie so only logged-in
// teammates can kick this off — visit /upload.html first, then navigate
// here directly.

const { requireSession } = require('./_lib/uploadAuth');

const REDIRECT_URI = 'https://roblox.code-builder.kr/api/youtube-oauth-callback';
// youtube.upload alone 403s on captions.insert (confirmed in M3 testing) —
// captions need the broader youtube.force-ssl scope.
const SCOPE = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.force-ssl',
].join(' ');

module.exports = async function handler(req, res) {
  if (!requireSession(req, res)) return;

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  if (!clientId) {
    console.error('YOUTUBE_CLIENT_ID is not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  });

  res.writeHead(302, { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  res.end();
};
