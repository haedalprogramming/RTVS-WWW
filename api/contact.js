// Vercel serverless function — forwards the Contact form to Slack and email.
// Requires SLACK_WEBHOOK_URL and RESEND_API_KEY environment variables to be
// set in the Vercel project (Project Settings → Environment Variables).
// Neither secret must ever be committed to the repo or shipped to the client.

const NOTIFICATION_EMAIL = 'code-builder@haedal.io';

const TYPE_LABELS = {
  personal: '개인',
  academy: '학교 · 기관',
  partnership: '제휴 · 미디어',
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

async function notifyEmail(apiKey, { name, org, email, typeLabel, message }) {
  const html = [
    `<p><strong>이름:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>기관명:</strong> ${org ? escapeHtml(org) : '-'}</p>`,
    `<p><strong>이메일:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>문의 유형:</strong> ${escapeHtml(typeLabel)}</p>`,
    `<p><strong>내용:</strong><br>${escapeHtml(message || '-').replace(/\n/g, '<br>')}</p>`,
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Code Builder 문의 <${NOTIFICATION_EMAIL}>`,
      to: [NOTIFICATION_EMAIL],
      reply_to: email,
      subject: `[Code Builder 문의] ${name}${org ? ` (${org})` : ''}`,
      html,
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

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!webhookUrl && !resendApiKey) {
    console.error('Neither SLACK_WEBHOOK_URL nor RESEND_API_KEY is configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { name, org, email, type, message } = req.body || {};

  if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
    return res.status(400).json({ error: 'name and email are required' });
  }
  if (name.length > 200 || email.length > 200 || (org && org.length > 200) || (message && message.length > 4000)) {
    return res.status(400).json({ error: 'Input too long' });
  }

  const typeLabel = TYPE_LABELS[type] || (type ? String(type).slice(0, 50) : '-');
  const trimmedOrg = org ? String(org).slice(0, 200) : '';
  const trimmedMessage = message ? String(message).slice(0, 4000) : '';

  const slackText = [
    '*새 문의가 도착했습니다 (Code Builder 웹사이트)*',
    `*이름:* ${name}`,
    `*기관명:* ${trimmedOrg || '-'}`,
    `*이메일:* ${email}`,
    `*문의 유형:* ${typeLabel}`,
    `*내용:*\n${trimmedMessage || '-'}`,
  ].join('\n');

  const results = await Promise.allSettled([
    webhookUrl ? notifySlack(webhookUrl, slackText) : Promise.resolve(),
    resendApiKey
      ? notifyEmail(resendApiKey, { name, org: trimmedOrg, email, typeLabel, message: trimmedMessage })
      : Promise.resolve(),
  ]);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('Contact notification failed', result.reason);
    }
  });

  if (results.every((result) => result.status === 'rejected')) {
    return res.status(502).json({ error: 'Failed to send notification' });
  }

  return res.status(200).json({ ok: true });
};
