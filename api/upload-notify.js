// Vercel serverless function — step 3 of the video-share upload flow.
// Once the browser finishes uploading a video (see api/upload-chunk.js), it
// calls this endpoint with the resulting Drive file id. We independently
// re-fetch the file from Drive (rather than trusting whatever the client
// claims) before posting to Slack, so a forged request can't fabricate a
// fake "new video" notification. A thank-you email is then sent to the
// submitter, worded in whichever language the /share page was on.
//
// Requires SLACK_WEBHOOK_URL (reused from api/contact.js) or, if the videos
// should post to a different channel, SLACK_VIDEO_WEBHOOK_URL. The
// thank-you email is best-effort and needs RESEND_API_KEY (also reused from
// api/contact.js) — if it's missing or the send fails, the request still
// succeeds as long as the Slack notification went through.

const { getFile } = require('./_lib/googleDrive.js');

const NOTIFICATION_EMAIL = 'code-builder@haedal.io';
const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

const THANK_YOU = {
  ko: {
    subject: '영상을 보내주셔서 감사합니다! - Code Builder',
    body: (label) => [
      `<p>안녕하세요, ${label}님!</p>`,
      '<p>재밌게 플레이한 영상을 보내주셔서 감사합니다. 저희 팀이 확인한 뒤 SNS나 커뮤니티에 소개해드릴 수도 있어요.</p>',
      '<p>앞으로도 Code Builder와 즐거운 시간 보내세요!</p>',
      '<p>- Code Builder 팀</p>',
    ].join('\n'),
  },
  en: {
    subject: 'Thanks for sharing your video! - Code Builder',
    body: (label) => [
      `<p>Hi ${label}!</p>`,
      "<p>Thanks so much for sending us your gameplay video. Our team will take a look, and it might even get featured on social media or in our community.</p>",
      '<p>Keep having fun with Code Builder!</p>',
      '<p>- The Code Builder Team</p>',
    ].join('\n'),
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

async function sendThankYouEmail(apiKey, { email, label, lang }) {
  const copy = THANK_YOU[lang] || THANK_YOU.ko;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Code Builder <${NOTIFICATION_EMAIL}>`,
      to: [email],
      subject: copy.subject,
      html: copy.body(escapeHtml(label)),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend API error ${res.status}: ${await res.text()}`);
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

  const { fileId, nickname, message, email, lang } = req.body || {};
  if (!fileId || typeof fileId !== 'string') {
    return res.status(400).json({ error: 'fileId is required' });
  }
  if (!email || typeof email !== 'string' || email.length > 200) {
    return res.status(400).json({ error: 'A valid email is required' });
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
  const contactEmail = String(email).trim().slice(0, 200);
  const submissionLang = lang === 'en' ? 'en' : 'ko';

  const text = [
    '*새 플레이 영상이 도착했습니다 (Code Builder)*',
    `*보낸 사람:* ${label}`,
    `*이메일:* ${contactEmail}`,
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

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      await sendThankYouEmail(resendApiKey, { email: contactEmail, label, lang: submissionLang });
    } catch (err) {
      console.error('Failed to send thank-you email', err);
    }
  }

  return res.status(200).json({ ok: true });
};
