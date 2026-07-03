// Vercel serverless function — forwards the Contact form to Slack.
// Requires the SLACK_WEBHOOK_URL environment variable to be set in the
// Vercel project (Project Settings → Environment Variables). The webhook
// URL must never be committed to the repo or shipped to the client.

const TYPE_LABELS = {
  personal: '개인',
  academy: '학원 · 기관',
  partnership: '제휴 · 미디어',
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL is not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { name, email, type, message } = req.body || {};

  if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
    return res.status(400).json({ error: 'name and email are required' });
  }
  if (name.length > 200 || email.length > 200 || (message && message.length > 4000)) {
    return res.status(400).json({ error: 'Input too long' });
  }

  const typeLabel = TYPE_LABELS[type] || (type ? String(type).slice(0, 50) : '-');

  const text = [
    '*새 문의가 도착했습니다 (Code Builder 웹사이트)*',
    `*이름/기관명:* ${name}`,
    `*이메일:* ${email}`,
    `*문의 유형:* ${typeLabel}`,
    `*내용:*\n${message ? String(message).slice(0, 4000) : '-'}`,
  ].join('\n');

  try {
    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!slackRes.ok) {
      console.error('Slack webhook error', slackRes.status, await slackRes.text());
      return res.status(502).json({ error: 'Failed to notify Slack' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Slack webhook request failed', err);
    return res.status(502).json({ error: 'Failed to notify Slack' });
  }
};
