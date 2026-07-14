// ─── Shorts Upload Page — Password Gate ─────────────────────
// Checks/sets the upload_session cookie via /api/upload-auth. The actual
// upload form (post-auth) is built separately; this only swaps in a
// placeholder once the password is accepted.

async function checkUploadSession() {
  const res = await fetch('/api/upload-auth');
  const data = await res.json();
  if (data.authenticated) showAuthedView();
}

function showAuthedView() {
  document.getElementById('authForm').hidden = true;
  document.getElementById('authedView').hidden = false;
}

function setAuthStatus(message, type) {
  const status = document.getElementById('authStatus');
  status.textContent = message;
  status.className = `form-status ${type}`;
  status.hidden = false;
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');

  submitBtn.disabled = true;
  try {
    const res = await fetch('/api/upload-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      showAuthedView();
      return;
    }

    setAuthStatus('비밀번호가 올바르지 않습니다.', 'error');
  } catch (err) {
    setAuthStatus('요청 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
  } finally {
    submitBtn.disabled = false;
  }
}

document.getElementById('authForm').addEventListener('submit', handleAuthSubmit);
checkUploadSession();
