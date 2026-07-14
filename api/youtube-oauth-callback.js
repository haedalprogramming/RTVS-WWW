// One-time setup helper (M2): exchanges the authorization code Google sends
// back here for a refresh_token, and displays it once so it can be copied
// into Vercel's YOUTUBE_REFRESH_TOKEN env var. Not session-gated — arriving
// here always means Google redirected back after /api/youtube-oauth-start
// (SameSite=Strict drops our session cookie on that cross-site redirect
// anyway), and a bare `code` on its own is single-use and useless without
// our client_secret.

const REDIRECT_URI = 'https://roblox.code-builder.kr/api/youtube-oauth-callback';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sendHtml(res, status, body) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(status).send(body);
}

module.exports = async function handler(req, res) {
  const { searchParams } = new URL(req.url, REDIRECT_URI);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return sendHtml(res, 400, `<p>인증 실패: ${escapeHtml(error)}</p>`);
  }
  if (!code) {
    return sendHtml(res, 400, '<p>code 파라미터가 없습니다.</p>');
  }

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error('YOUTUBE_CLIENT_ID/YOUTUBE_CLIENT_SECRET is not configured');
    return sendHtml(res, 500, '<p>서버 설정 오류입니다.</p>');
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const data = await tokenRes.json();

  if (!tokenRes.ok) {
    console.error('YouTube token exchange failed', data);
    return sendHtml(res, 502, `<p>토큰 교환 실패: ${escapeHtml(data.error_description || data.error || '알 수 없는 오류')}</p>`);
  }

  if (!data.refresh_token) {
    return sendHtml(
      res,
      200,
      `<p>refresh_token이 발급되지 않았습니다. 이미 한 번 인증한 계정이면 Google이 다시 안 줄 수 있어요.
      <a href="https://myaccount.google.com/permissions" target="_blank">Google 계정 권한 페이지</a>에서
      이 앱(Code Builder) 액세스를 제거한 뒤 <a href="/api/youtube-oauth-start">여기서 다시 시도</a>해주세요.</p>`
    );
  }

  return sendHtml(
    res,
    200,
    `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /><title>YouTube 인증 완료</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 60px auto; padding: 0 20px;">
  <h1>인증 완료</h1>
  <p>아래 refresh token을 복사해서 <code>.env.local</code>의 <code>YOUTUBE_REFRESH_TOKEN</code>에 붙여넣고,
  Claude에게 Vercel 등록을 요청하세요. 이 페이지를 벗어나면 다시 볼 수 없습니다.</p>
  <textarea readonly style="width:100%;height:100px;">${escapeHtml(data.refresh_token)}</textarea>
</body>
</html>`
  );
};
