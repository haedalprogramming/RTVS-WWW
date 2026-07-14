// M3: publishes one YouTube upload (caller sends this twice — once per
// language — from the orchestrator in #43 M7). Video source is a Drive file
// already sitting in GOOGLE_DRIVE_FOLDER_ID (per the #36 M0 storage
// decision) — the video is uploaded byte-for-byte identical for every call;
// only title/description/language/captions differ.

const { requireSession } = require('./_lib/uploadAuth');
const { getFile, downloadFile } = require('./_lib/googleDrive');
const { createResumableSession, uploadVideoContent, attachCaption } = require('./_lib/youtubeUpload');

module.exports = async function handler(req, res) {
  if (!requireSession(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { driveFileId, language, title, description, srt, privacyStatus, publishAt } = req.body || {};

  if (!driveFileId || typeof driveFileId !== 'string') {
    return res.status(400).json({ error: 'driveFileId is required' });
  }
  if (language !== 'ko' && language !== 'en') {
    return res.status(400).json({ error: 'language must be "ko" or "en"' });
  }
  if (!title || typeof title !== 'string' || !description || typeof description !== 'string') {
    return res.status(400).json({ error: 'title and description are required' });
  }
  const status = privacyStatus === 'private' ? 'private' : 'public';
  if (status === 'private' && publishAt && Number.isNaN(Date.parse(publishAt))) {
    return res.status(400).json({ error: 'publishAt must be a valid ISO 8601 timestamp' });
  }

  try {
    const file = await getFile(driveFileId);
    const size = Number(file.size);
    const mimeType = file.mimeType || 'video/mp4';
    if (!size) throw new Error(`Drive file ${driveFileId} has no size metadata`);

    const uploadUrl = await createResumableSession({
      title,
      description,
      language,
      privacyStatus: status,
      publishAt: status === 'private' ? publishAt : undefined,
      size,
      mimeType,
    });

    const download = await downloadFile(driveFileId);
    const video = await uploadVideoContent({ uploadUrl, body: download.body, size, mimeType });

    let caption = null;
    if (srt && typeof srt === 'string') {
      caption = await attachCaption({ videoId: video.id, language, srtContent: srt });
    }

    return res.status(200).json({
      ok: true,
      videoId: video.id,
      url: `https://youtube.com/watch?v=${video.id}`,
      privacyStatus: video.status && video.status.privacyStatus,
      captionAttached: Boolean(caption),
    });
  } catch (err) {
    console.error('YouTube upload failed', err);
    return res.status(502).json({ error: 'YouTube upload failed', detail: String(err.message || err) });
  }
};
