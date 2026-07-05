// Vercel serverless function — step 1 of the video-share upload flow.
// Creates a timestamped subfolder under GOOGLE_DRIVE_FOLDER_ID and starts a
// Google Drive resumable upload session for the video that will go inside it.
// The actual video bytes never pass through this function (or through
// Vercel at all in one shot) — see api/upload-chunk.js, which relays the
// browser's chunk PUTs to the session URL returned here.
//
// Requires GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
// and GOOGLE_DRIVE_FOLDER_ID in the Vercel project's environment variables.
// The service account must be shared as an Editor on that Drive folder.

const { createSubmissionFolder, createResumableSession } = require('./_lib/googleDrive.js');

const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB
const CHUNK_SIZE_BYTES = 4 * 1024 * 1024; // multiple of 256KB, matches api/upload-chunk.js
const ALLOWED_MIME_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-matroska',
  'video/x-msvideo',
  'video/mpeg',
  'video/3gpp',
]);

function sanitizeFileName(name) {
  return String(name).trim().slice(0, 200) || 'video';
}

function sanitizeLabel(value, maxLength) {
  return String(value).trim().slice(0, maxLength);
}

// Folder name like "2026-07-05_14-30-05 코드빌더짱" in Korea Standard Time,
// so submissions sort chronologically and are easy to eyeball in Drive.
function submissionFolderName(nickname) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const stamp = `${get('year')}-${get('month')}-${get('day')}_${get('hour')}-${get('minute')}-${get('second')}`;
  return nickname ? `${stamp} ${nickname}` : stamp;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
    console.error('Google Drive upload is not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { fileName, fileSize, mimeType, nickname, message, email } = req.body || {};

  if (!fileName || typeof fileName !== 'string') {
    return res.status(400).json({ error: 'fileName is required' });
  }
  const size = Number(fileSize);
  if (!Number.isFinite(size) || size <= 0) {
    return res.status(400).json({ error: 'fileSize is required' });
  }
  if (size > MAX_SIZE_BYTES) {
    return res.status(400).json({ error: 'File exceeds the 2GB limit' });
  }
  if (!mimeType || typeof mimeType !== 'string' || !ALLOWED_MIME_TYPES.has(mimeType)) {
    return res.status(400).json({ error: 'Unsupported video format' });
  }
  if (!email || typeof email !== 'string' || email.length > 200) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  if ((nickname && String(nickname).length > 100) || (message && String(message).length > 1000)) {
    return res.status(400).json({ error: 'Input too long' });
  }

  const label = sanitizeLabel(nickname || '', 100) || '익명';
  const note = sanitizeLabel(message || '', 1000);
  const contactEmail = sanitizeLabel(email, 200);

  try {
    const folderId = await createSubmissionFolder(submissionFolderName(nickname ? label : ''));
    const uploadUrl = await createResumableSession({
      name: sanitizeFileName(fileName),
      description: [`업로더: ${label}`, `이메일: ${contactEmail}`, note].filter(Boolean).join('\n').slice(0, 2000),
      mimeType,
      size,
      parentFolderId: folderId,
    });
    return res.status(200).json({ uploadUrl, chunkSize: CHUNK_SIZE_BYTES });
  } catch (err) {
    console.error('Failed to start Drive upload session', err);
    return res.status(502).json({ error: 'Failed to start upload' });
  }
};
