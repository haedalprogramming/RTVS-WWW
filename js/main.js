// ─── Translations ───────────────────────────────────────────
// T is defined in js/i18n-data.js (loaded before this file).

// ─── Language Switcher ──────────────────────────────────────
function setLang(lang) {
  if (!T[lang]) return;
  document.documentElement.lang = lang;
  localStorage.setItem('cb-lang', lang);

  // Update text/html elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = T[lang][el.dataset.i18n];
    if (val == null) return;
    if (el.tagName === 'OPTION') {
      el.textContent = val;
    } else if (el.tagName === 'BUTTON' && el.type === 'submit') {
      el.innerHTML = val;
    } else {
      el.innerHTML = val;
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const val = T[lang][el.dataset.i18nPh];
    if (val != null) el.placeholder = val;
  });

  // Update toggle button states
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// ─── Nav ────────────────────────────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
  document.querySelector('.nav-toggle').classList.toggle('open');
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.querySelector('.nav-toggle').classList.remove('open');
  });
});

// ─── Scroll fade-in ─────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .step, .stat-card, .team-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ─── Contact Form ────────────────────────────────────────────
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('formStatus');
  const btn = form.querySelector('button[type="submit"]');
  const lang = document.documentElement.lang || 'ko';

  btn.disabled = true;
  btn.textContent = lang === 'en' ? 'Sending…' : '전송 중…';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.value,
        org: form.org.value,
        email: form.email.value,
        type: form.type.value,
        message: form.message.value,
      }),
    });
    if (!res.ok) throw new Error('request failed');

    status.hidden = false;
    status.className = 'form-status success';
    status.textContent = T[lang]['form-success'];
    form.reset();
  } catch (err) {
    status.hidden = false;
    status.className = 'form-status error';
    status.textContent = T[lang]['form-error'];
  } finally {
    btn.disabled = false;
    btn.innerHTML = T[lang]['form-submit'];
    // Re-apply placeholders after reset
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const val = T[lang][el.dataset.i18nPh];
      if (val != null) el.placeholder = val;
    });
  }
}

// ─── Init ────────────────────────────────────────────────────
// Dedicated /en/ pages are statically pre-rendered in English for SEO —
// leave them alone so crawlers (and users landing there directly) see
// real English content instead of it flipping back via a stale
// localStorage preference. The instant client-side toggle stays fully
// active on the original (non-/en/) URLs so already-shared links keep
// working exactly as before.
if (document.documentElement.lang === 'en') {
  localStorage.setItem('cb-lang', 'en');
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === 'en');
  });
} else {
  const savedLang = localStorage.getItem('cb-lang') || 'ko';
  setLang(savedLang);
}
