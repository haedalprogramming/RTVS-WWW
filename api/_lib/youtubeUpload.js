// Shared YouTube Data API v3 helper for the Shorts multi-upload tool.
// Auth is a user OAuth refresh token (YOUTUBE_CLIENT_ID/SECRET/REFRESH_TOKEN)
// obtained once via api/youtube-oauth-start.js + api/youtube-oauth-callback.js
// — a service account cannot upload to a personal/brand channel.

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const VIDEOS_UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/videos';
const CAPTIONS_UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/captions';

const CATEGORY_ID_GAMING = '20';

// Cached per warm lambda instance — same rationale as api/_lib/googleDrive.js.
let cachedToken = null;
let cachedExpiryMs = 0;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < cachedExpiryMs - 60000) return cachedToken;

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN are not configured');
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) {
    throw new Error(`YouTube token refresh error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  cachedExpiryMs = now + data.expires_in * 1000;
  return cachedToken;
}

// Fixed metadata decided in #35/#36: Gaming category, Korean audio always
// (both language versions are the same spoken audio), and explicitly not
// made-for-kids. Only title/description/language/privacy vary per call.
function buildVideoResource({ title, description, language, privacyStatus, publishAt }) {
  const status = { privacyStatus, selfDeclaredMadeForKids: false };
  if (privacyStatus === 'private' && publishAt) status.publishAt = publishAt;

  return {
    snippet: {
      title,
      description,
      categoryId: CATEGORY_ID_GAMING,
      defaultAudioLanguage: 'ko',
      defaultLanguage: language,
    },
    status,
  };
}

// Starts a resumable upload session for a new video. Returns the session URL
// that the caller PUTs the actual video bytes to (see uploadVideoContent).
async function createResumableSession({ title, description, language, privacyStatus, publishAt, size, mimeType }) {
  const accessToken = await getAccessToken();
  const resource = buildVideoResource({ title, description, language, privacyStatus, publishAt });

  const res = await fetch(`${VIDEOS_UPLOAD_URL}?uploadType=resumable&part=snippet,status`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': mimeType,
      'X-Upload-Content-Length': String(size),
    },
    body: JSON.stringify(resource),
  });
  if (!res.ok) {
    throw new Error(`YouTube resumable session error ${res.status}: ${await res.text()}`);
  }
  const location = res.headers.get('location');
  if (!location) throw new Error('YouTube did not return a resumable session URL');
  return location;
}

// Streams the video bytes to an already-created resumable session. `body`
// may be a web ReadableStream (e.g. a Drive download response's .body).
async function uploadVideoContent({ uploadUrl, body, size, mimeType }) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
      'Content-Length': String(size),
    },
    body,
    duplex: 'half',
  });
  if (!res.ok) {
    throw new Error(`YouTube video upload error ${res.status}: ${await res.text()}`);
  }
  return res.json(); // { id, snippet, status, ... }
}

// Attaches a caption track (.srt) to an already-uploaded video. Built as a
// raw multipart/related body by hand, matching the style already used in
// this codebase (api/contact.js, api/_lib/googleDrive.js) of talking to
// Google APIs with plain fetch instead of pulling in googleapis/multer.
async function attachCaption({ videoId, language, srtContent }) {
  const accessToken = await getAccessToken();
  const boundary = `shorts_upload_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const metadata = { snippet: { videoId, language, name: '', isDraft: false } };
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`),
    Buffer.from(srtContent, 'utf8'),
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const res = await fetch(`${CAPTIONS_UPLOAD_URL}?uploadType=multipart&part=snippet`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': String(body.length),
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`YouTube caption upload error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

module.exports = { getAccessToken, createResumableSession, uploadVideoContent, attachCaption };
