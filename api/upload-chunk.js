// Vercel serverless function — step 2 of the video-share upload flow.
// The browser splits the video into small chunks and PUTs each one here;
// this function relays each chunk to the Google Drive resumable session
// server-to-server. Two constraints drive this design:
//   1. Vercel Node functions cap request bodies at roughly 4.5MB, so a 2GB
//      video cannot pass through in one request — chunking keeps each hop
//      well under that ceiling.
//   2. Google's resumable upload endpoint isn't reliably reachable via CORS
//      from an arbitrary browser origin, so the browser never talks to
//      googleapis.com directly — only to this same-origin endpoint, which
//      forwards the bytes server-to-server (no CORS involved).
//
// The x-upload-url header carries the session URL api/upload-init.js
// returned to the browser. Because a client-supplied URL feeds a
// server-side fetch, isAllowedUploadUrl() strictly pins it to Google's
// Drive upload host/path/query shape to rule out SSRF.

const MAX_CHUNK_BYTES = 8 * 1024 * 1024; // headroom above the 4MB chunks the client sends
const CONTENT_RANGE_RE = /^bytes \d+-\d+\/(\d+|\*)$/;

function isAllowedUploadUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch (err) {
    return false;
  }
  return (
    url.protocol === 'https:' &&
    url.hostname === 'www.googleapis.com' &&
    url.pathname.startsWith('/upload/drive/v3/files') &&
    url.searchParams.has('upload_id')
  );
}

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadUrl = req.headers['x-upload-url'];
  const contentRange = req.headers['content-range'];

  if (!uploadUrl || Array.isArray(uploadUrl) || !isAllowedUploadUrl(uploadUrl)) {
    return res.status(400).json({ error: 'Invalid upload session' });
  }
  if (!contentRange || Array.isArray(contentRange) || !CONTENT_RANGE_RE.test(contentRange)) {
    return res.status(400).json({ error: 'Invalid Content-Range' });
  }

  let chunk;
  try {
    chunk = await readRawBody(req);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to read chunk' });
  }
  if (chunk.length > MAX_CHUNK_BYTES) {
    return res.status(413).json({ error: 'Chunk too large' });
  }

  let upstream;
  try {
    upstream = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Range': contentRange,
        'Content-Length': String(chunk.length),
      },
      body: chunk,
    });
  } catch (err) {
    console.error('Failed to relay chunk to Drive', err);
    return res.status(502).json({ error: 'Upload relay failed' });
  }

  if (upstream.status === 308) {
    // Respond 200 to our own caller even though Drive said 308 — a raw 308
    // is a real HTTP redirect status and fetch() would try to follow it.
    // The client reads the true progress state from the JSON body instead.
    return res.status(200).json({ status: 308 });
  }
  if (upstream.ok) {
    const file = await upstream.json().catch(() => null);
    return res.status(200).json({ status: upstream.status, file });
  }

  const text = await upstream.text().catch(() => '');
  console.error(`Drive chunk upload error ${upstream.status}: ${text}`);
  return res.status(502).json({ error: 'Upload rejected by Drive', status: upstream.status });
};
