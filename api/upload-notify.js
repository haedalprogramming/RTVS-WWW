// Vercel serverless function — step 3 of the video-share upload flow.
// Once the browser finishes uploading a video (see api/upload-chunk.js), it
// calls this endpoint with the resulting Drive file id. We independently
// re-fetch the file from Drive (rather than trusting whatever the client
// claims) before posting to Slack, so a forged request can't fabricate a
// fake "new video" notification.
//
// Requires SLACK_WEBHOOK_URL (reused from api/contact.js) or, if the videos
// should post to a different channel, SLACK_VIDEO_WEBHOOK_URL.

const { getFile } = require('./_lib/googleDrive.js');

const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

function formatBytes(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)}GB`;
  return `${mb.toFixed(1)}MB`;
}

async function notifySlack(webhookUrl, text) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error(`Slack webhook error ${res.status}: ${await res.text()}`);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.SLACK_VIDEO_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL is not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { fileId, nickname, message } = req.body || {};
  if (!fileId || typeof fileId !== 'string') {
    return res.status(400).json({ error: 'fileId is required' });
  }
  if ((nickname && String(nickname).length > 100) || (message && String(message).length > 1000)) {
    return res.status(400).json({ error: 'Input too long' });
  }

  let file;
  try {
    file = await getFile(fileId);
  } catch (err) {
    console.error('Failed to verify uploaded file', err);
    return res.status(502).json({ error: 'Failed to verify upload' });
  }

  const isVideo = typeof file.mimeType === 'string' && file.mimeType.startsWith('video/');
  const size = Number(file.size);
  const withinSizeLimit = size > 0 && size <= MAX_SIZE_BYTES;
  if (!isVideo || !withinSizeLimit) {
    console.error('Rejected notify for unexpected file', file);
    return res.status(400).json({ error: 'Upload could not be verified' });
  }

  const label = nickname ? String(nickname).trim().slice(0, 100) : '익명';
  const note = message ? String(message).trim().slice(0, 1000) : '';

  const text = [
    '*새 플레이 영상이 도착했습니다 (Code Builder)*',
    `*보낸 사람:* ${label}`,
    `*파일명:* ${file.name}`,
    `*크기:* ${formatBytes(size)}`,
    note ? `*메시지:*\n${note}` : null,
    `*드라이브 링크:* ${file.webViewLink}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await notifySlack(webhookUrl, text);
  } catch (err) {
    console.error('Failed to notify Slack', err);
    return res.status(502).json({ error: 'Failed to notify Slack' });
  }

  return res.status(200).json({ ok: true });
};
