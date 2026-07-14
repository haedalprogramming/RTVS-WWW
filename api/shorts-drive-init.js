// Step 1 of the Shorts upload tool's video intake: creates a Drive resumable
// upload session for the raw video file. Step 2 (relaying chunk PUTs) reuses
// the existing api/upload-chunk.js as-is — it's already generic (just
// forwards bytes to whatever valid Drive session URL it's given).
// Session-gated: only logged-into-/upload.html teammates can start one.

const { requireSession } = require('./_lib/uploadAuth');
const { createSubmissionFolder, createResumableSession } = require('./_lib/googleDrive');

const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB
const CHUNK_SIZE_BYTES = 4 * 1024 * 1024; // matches api/upload-chunk.js
const ALLOWED_MIME_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska']);

function sanitizeFileName(name) {
  return String(name).trim().slice(0, 200) || 'shorts-video';
}

function folderName() {
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
  return `shorts_${get('year')}-${get('month')}-${get('day')}_${get('hour')}-${get('minute')}-${get('second')}`;
}

module.exports = async function handler(req, res) {
  if (!requireSession(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
    console.error('Google Drive upload is not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { fileName, fileSize, mimeType } = req.body || {};

  if (!fileName || typeof fileName !== 'string') {
    return res.status(400).json({ error: 'fileName is required' });
  }
  const size = Number(fileSize);
  if (!Number.isFinite(size) || size <= 0 || size > MAX_SIZE_BYTES) {
    return res.status(400).json({ error: 'fileSize is required and must be under 2GB' });
  }
  if (!mimeType || typeof mimeType !== 'string' || !ALLOWED_MIME_TYPES.has(mimeType)) {
    return res.status(400).json({ error: 'Unsupported video format' });
  }

  try {
    const folderId = await createSubmissionFolder(folderName());
    const uploadUrl = await createResumableSession({
      name: sanitizeFileName(fileName),
      description: 'Shorts 업로드 도구를 통해 업로드된 원본 영상',
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
