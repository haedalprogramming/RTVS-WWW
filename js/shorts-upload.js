// ─── Shorts Upload Form (post-auth) ──────────────────────────
// Uploads the raw video to Drive in chunks (same relay endpoint the
// share-video feature uses, api/upload-chunk.js — it's generic), then
// publishes to each checked platform. Only YouTube is wired up so far
// (TikTok's checkbox stays disabled until #40's app review is approved).
// Supports "지금" / "비공개" / "예약" publish timing (#46 M8 — YouTube-side
// only; scheduling for TikTok needs its own cron since the API has no
// native publishAt equivalent).

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
    if (!res.ok) throw new Error(`청크 업로드 실패: ${res.status}`);

    const data = await res.json();
    offset = end;
    onProgress(offset / file.size);

    if (data.status === 200 || data.status === 201) {
      if (!data.file || !data.file.id) throw new Error('업로드는 끝났는데 file id가 없습니다');
      return data.file.id;
    }
  }
  throw new Error('업로드가 끝까지 완료되지 않았습니다');
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function appendResult(label, ok, detailHtml) {
  const results = document.getElementById('shortsResults');
  const row = document.createElement('div');
  row.className = `form-status ${ok ? 'success' : 'error'}`;
  row.innerHTML = `<strong>${label}</strong> — ${detailHtml}`;
  results.appendChild(row);
}

function youtubeResultDetail(result) {
  if (!result.ok) return `실패 — ${result.data.error || ''} ${result.data.detail || ''}`;
  const link = `<a href="${result.data.url}" target="_blank">${result.data.url}</a>`;
  if (result.data.captionError) return `${link} (자막 첨부 실패: ${result.data.captionError})`;
  if (result.data.publishAt) {
    const when = new Date(result.data.publishAt).toLocaleString('ko-KR');
    return `${link} (${when}에 자동 공개 예약됨)`;
  }
  return link;
}

async function publishToYoutube({ driveFileId, language, title, description, srtFile, privacyStatus, publishAt }) {
  const srt = srtFile ? await readFileAsText(srtFile) : undefined;
  const res = await fetch('/api/youtube-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driveFileId, language, title, description, srt, privacyStatus, publishAt }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

function initScheduleToggle() {
  const datetimeGroup = document.getElementById('scheduleDatetimeGroup');
  const datetimeInput = document.getElementById('schedule-datetime');

  // Can't schedule into the past — floor the picker at "5 minutes from now".
  const min = new Date(Date.now() + 5 * 60 * 1000);
  min.setSeconds(0, 0);
  datetimeInput.min = min.toISOString().slice(0, 16);

  document.querySelectorAll('input[name="schedule-mode"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      datetimeGroup.hidden = radio.value !== 'scheduled' || !radio.checked;
    });
  });
}

// Returns { privacyStatus, publishAt } for the currently selected schedule
// mode, or throws if "예약 게시" is selected without a valid future time.
function readScheduleChoice() {
  const mode = document.querySelector('input[name="schedule-mode"]:checked').value;
  if (mode === 'now') return { privacyStatus: 'public', publishAt: undefined };
  if (mode === 'private') return { privacyStatus: 'private', publishAt: undefined };

  const raw = document.getElementById('schedule-datetime').value;
  if (!raw) throw new Error('예약 시각을 선택해주세요.');
  const publishAt = new Date(raw);
  if (Number.isNaN(publishAt.getTime()) || publishAt.getTime() <= Date.now()) {
    throw new Error('예약 시각은 미래 시점이어야 합니다.');
  }
  return { privacyStatus: 'private', publishAt: publishAt.toISOString() };
}

const RELATED_VIDEO_LABEL = { ko: '전체 영상 보기', en: 'Watch the full video' };

// YouTube's Data API has no dedicated "related video" field for Shorts —
// the only reliable, API-accessible way to point viewers at a long-form
// video is a plain link at the end of the description.
function withRelatedVideoLink(description, relatedUrl, lang) {
  if (!relatedUrl) return description;
  return [description, `${RELATED_VIDEO_LABEL[lang]}: ${relatedUrl}`].filter(Boolean).join('\n\n');
}

function setStatus(message, type) {
  const status = document.getElementById('shortsStatus');
  status.textContent = message;
  status.className = `form-status ${type}`;
  status.hidden = false;
}

async function handleShortsSubmit(e) {
  e.preventDefault();
  const status = document.getElementById('shortsStatus');
  const results = document.getElementById('shortsResults');
  status.hidden = true;
  results.innerHTML = '';

  const file = document.getElementById('video').files[0];
  const titleKo = document.getElementById('title-ko').value.trim();
  const descKo = document.getElementById('desc-ko').value.trim();

  if (!file) return setStatus('영상 파일을 선택해주세요.', 'error');
  if (file.size > MAX_VIDEO_BYTES) return setStatus('영상 파일이 너무 큽니다 (최대 2GB).', 'error');
  if (!titleKo || !descKo) return setStatus('한국어 제목과 설명은 필수입니다.', 'error');

  const hashtags = document.getElementById('hashtags').value.trim();
  const relatedVideoUrl = document.getElementById('related-video-url').value.trim();
  const titleEn = document.getElementById('title-en').value.trim();
  const descEn = document.getElementById('desc-en').value.trim();
  const srtKoFile = document.getElementById('srt-ko').files[0];
  const srtEnFile = document.getElementById('srt-en').files[0];
  const youtubeEnabled = document.getElementById('platform-youtube').checked;

  let schedule;
  try {
    schedule = readScheduleChoice();
  } catch (err) {
    return setStatus(err.message, 'error');
  }

  const btn = e.target.querySelector('button[type="submit"]');
  const progressWrap = document.getElementById('uploadProgress');
  const progressFill = document.getElementById('uploadProgressFill');
  const progressLabel = document.getElementById('uploadProgressLabel');

  btn.disabled = true;
  progressWrap.hidden = false;
  progressFill.style.width = '0%';
  progressLabel.textContent = '0%';

  try {
    const initRes = await fetch('/api/shorts-drive-init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, fileSize: file.size, mimeType: file.type }),
    });
    if (!initRes.ok) throw new Error('업로드 시작에 실패했습니다');
    const { uploadUrl, chunkSize } = await initRes.json();

    const driveFileId = await uploadInChunks(file, uploadUrl, chunkSize, (ratio) => {
      progressFill.style.width = `${Math.round(ratio * 100)}%`;
      progressLabel.textContent = `${Math.round(ratio * 100)}%`;
    });

    setStatus('영상 업로드 완료. 플랫폼별로 게시 중...', 'success');

    if (youtubeEnabled) {
      const koDescription = withRelatedVideoLink([descKo, hashtags].filter(Boolean).join('\n\n'), relatedVideoUrl, 'ko');
      const koResult = await publishToYoutube({
        driveFileId,
        language: 'ko',
        title: titleKo,
        description: koDescription,
        srtFile: srtKoFile,
        privacyStatus: schedule.privacyStatus,
        publishAt: schedule.publishAt,
      });
      appendResult('YouTube (한국어)', koResult.ok, youtubeResultDetail(koResult));

      if (titleEn && descEn) {
        const enDescription = withRelatedVideoLink([descEn, hashtags].filter(Boolean).join('\n\n'), relatedVideoUrl, 'en');
        const enResult = await publishToYoutube({
          driveFileId,
          language: 'en',
          title: titleEn,
          description: enDescription,
          srtFile: srtEnFile,
          privacyStatus: schedule.privacyStatus,
          publishAt: schedule.publishAt,
        });
        appendResult('YouTube (English)', enResult.ok, youtubeResultDetail(enResult));
      }
    }

    setStatus('게시 요청 완료. 위 결과를 확인해주세요.', 'success');
  } catch (err) {
    setStatus(`오류: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
  }
}

const shortsForm = document.getElementById('shortsForm');
if (shortsForm) {
  shortsForm.addEventListener('submit', handleShortsSubmit);
  initScheduleToggle();
}
