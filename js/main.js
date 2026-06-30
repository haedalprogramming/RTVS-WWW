// Nav scroll effect
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const toggle = document.querySelector('.nav-toggle');
  links.classList.toggle('open');
  toggle.classList.toggle('open');
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.querySelector('.nav-toggle').classList.remove('open');
  });
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
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

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('formStatus');
  const btn = form.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.textContent = '전송 중...';

  // GitHub Pages에서는 Formspree 등 외부 서비스 없이 네이티브 submit 불가
  // 실제 배포 시 Formspree action URL 또는 서버 엔드포인트로 교체하세요
  setTimeout(() => {
    status.hidden = false;
    status.className = 'form-status success';
    status.textContent = '감사합니다! 빠른 시일 내에 연락드리겠습니다.';
    form.reset();
    btn.disabled = false;
    btn.textContent = '보내기 →';
  }, 800);
}
