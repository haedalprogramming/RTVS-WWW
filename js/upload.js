// ─── Share Video Form ───────────────────────────────────────
// Uploads go straight from the browser to Google Drive in small chunks,
// relayed through /api/upload-chunk (see that file for why: Vercel's
// request body cap and Drive's CORS support rule out simpler approaches).

const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

function uploadChunk(chunk, uploadUrl, contentRange) {
  return fetch('/api/upload-chunk', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Upload-Url': uploadUrl,
      'Content-Range': contentRange,
    },
    body: chunk,
  });
}

async function uploadInChunks(file, uploadUrl, chunkSize, onProgress) {
  let offset = 0;
  while (offset < file.size) {
    const end = Math.min(offset + chunkSize, file.size);
    const chunk = file.slice(offset, end);
    const contentRange = `bytes ${offset}-${end - 1}/${file.size}`;
    const res = await uploadChunk(chunk, uploadUrl, contentRange);
    if (!res.ok) throw new Error(`Chunk upload failed: ${res.status}`);

    const data = await res.json();
    offset = end;
    onProgress(offset / file.size);

    if (data.status === 200 || data.status === 201) {
      if (!data.file || !data.file.id) throw new Error('Missing file id on completion');
      return data.file.id;
    }
  }
  throw new Error('Upload did not complete');
}

async function handleShareSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('shareStatus');
  const btn = form.querySelector('button[type="submit"]');
  const lang = document.documentElement.lang || 'ko';
  const fileInput = document.getElementById('video');
  const file = fileInput.files[0];
  const progressWrap = document.getElementById('uploadProgress');
  const progressFill = document.getElementById('uploadProgressFill');
  const progressLabel = document.getElementById('uploadProgressLabel');

  status.hidden = true;

  if (!file) {
    status.hidden = false;
    status.className = 'form-status error';
    status.textContent = T[lang]['share-error-nofile'];
    return;
  }
  if (file.size > MAX_VIDEO_BYTES) {
    status.hidden = false;
    status.className = 'form-status error';
    status.textContent = T[lang]['share-error-toolarge'];
    return;
  }

  btn.disabled = true;
  btn.textContent = T[lang]['share-uploading'];
  progressWrap.hidden = false;
  progressFill.style.width = '0%';
  progressLabel.textContent = '0%';

  try {
    const initRes = await fetch('/api/upload-init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        nickname: form.nickname.value,
        message: form.message.value,
      }),
    });
    if (!initRes.ok) throw new Error('init failed');
    const { uploadUrl, chunkSize } = await initRes.json();

    const fileId = await uploadInChunks(file, uploadUrl, chunkSize, (fraction) => {
      const pct = Math.round(fraction * 100);
      progressFill.style.width = `${pct}%`;
      progressLabel.textContent = `${pct}%`;
    });

    const notifyRes = await fetch('/api/upload-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileId,
        nickname: form.nickname.value,
        message: form.message.value,
      }),
    });
    if (!notifyRes.ok) throw new Error('notify failed');

    status.hidden = false;
    status.className = 'form-status success';
    status.textContent = T[lang]['share-success'];
    form.reset();
    progressWrap.hidden = true;
  } catch (err) {
    status.hidden = false;
    status.className = 'form-status error';
    status.textContent = T[lang]['share-error'];
  } finally {
    btn.disabled = false;
    btn.innerHTML = T[lang]['share-submit'];
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const val = T[lang][el.dataset.i18nPh];
      if (val != null) el.placeholder = val;
    });
  }
}
