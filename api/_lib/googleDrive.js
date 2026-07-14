// Shared Google Drive helper for the video-share upload flow.
// Prefixed with an underscore so Vercel does not turn this into its own
// Serverless Function — see api/upload-init.js / api/upload-chunk.js /
// api/upload-notify.js for the endpoints that use it.
//
// Auth is a service account (GOOGLE_SERVICE_ACCOUNT_EMAIL +
// GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) that must be shared as an Editor on
// GOOGLE_DRIVE_FOLDER_ID. We sign the JWT by hand with Node's crypto module
// to avoid pulling in the (heavy) googleapis/google-auth-library packages —
// this project has zero npm dependencies today and api/contact.js already
// talks to Slack/Resend with raw fetch calls in the same style.

const crypto = require('crypto');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const SCOPE = 'https://www.googleapis.com/auth/drive';

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function signJwt(clientEmail, privateKey) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = { iss: clientEmail, scope: SCOPE, aud: TOKEN_URL, iat, exp };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claimSet))}`;
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(privateKey, 'base64');
  const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${unsigned}.${encodedSignature}`;
}

// Cached per warm lambda instance — avoids re-signing a JWT and round-tripping
// to Google on every request. Safe to lose on cold start (just refetches).
let cachedToken = null;
let cachedExpiryMs = 0;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < cachedExpiryMs - 60000) return cachedToken;

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!clientEmail || !rawKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY are not configured');
  }
  const privateKey = rawKey.replace(/\\n/g, '\n');
  const jwt = signJwt(clientEmail, privateKey);

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`Google token error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  cachedExpiryMs = now + data.expires_in * 1000;
  return cachedToken;
}

// Creates a subfolder (named by the caller, typically a submission timestamp)
// under GOOGLE_DRIVE_FOLDER_ID so each upload lands in its own folder.
async function createSubmissionFolder(name) {
  const accessToken = await getAccessToken();
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!rootFolderId) throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');

  const res = await fetch(`${DRIVE_FILES_URL}?supportsAllDrives=true&fields=id`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [rootFolderId],
    }),
  });
  if (!res.ok) {
    throw new Error(`Drive folder creation error ${res.status}: ${await res.text()}`);
  }
  const folder = await res.json();
  return folder.id;
}

// Starts a resumable upload session for a file inside parentFolderId.
// Returns the session URL that api/upload-chunk.js relays PUT chunks to.
async function createResumableSession({ name, description, mimeType, size, parentFolderId }) {
  const accessToken = await getAccessToken();
  const fields = encodeURIComponent('id,name,size,mimeType,webViewLink');
  const res = await fetch(`${DRIVE_UPLOAD_URL}?uploadType=resumable&supportsAllDrives=true&fields=${fields}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': mimeType,
      'X-Upload-Content-Length': String(size),
    },
    body: JSON.stringify({ name, description, parents: [parentFolderId] }),
  });
  if (!res.ok) {
    throw new Error(`Drive resumable session error ${res.status}: ${await res.text()}`);
  }
  const location = res.headers.get('location');
  if (!location) throw new Error('Drive did not return a resumable session URL');
  return location;
}

async function getFile(fileId) {
  const accessToken = await getAccessToken();
  const fields = encodeURIComponent('id,name,size,mimeType,webViewLink,parents');
  const res = await fetch(`${DRIVE_FILES_URL}/${encodeURIComponent(fileId)}?fields=${fields}&supportsAllDrives=true`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Drive file lookup error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// Downloads a file's raw bytes. Returns the fetch Response so callers can
// stream `.body` straight into another upload (e.g. YouTube/TikTok) instead
// of buffering the whole video in memory.
async function downloadFile(fileId) {
  const accessToken = await getAccessToken();
  const res = await fetch(`${DRIVE_FILES_URL}/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Drive file download error ${res.status}: ${await res.text()}`);
  }
  return res;
}

module.exports = { getAccessToken, createSubmissionFolder, createResumableSession, getFile, downloadFile };
