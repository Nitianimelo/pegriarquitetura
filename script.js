// === VIDEO HERO ROTATION ===
(function () {
  const vids = Array.from(document.querySelectorAll('.hero-vid'));
  if (!vids.length) return;
  let idx = 0;

  function nextVideo() {
    vids[idx].classList.remove('active');
    idx = (idx + 1) % vids.length;
    const next = vids[idx];
    // preload and play
    next.load();
    next.play().catch(() => { });
    next.classList.add('active');
  }

  // Each video loops once (≈8s), then switch. Use 'ended' on non-looping vids.
  vids.forEach((v, i) => {
    v.loop = false;
    v.addEventListener('ended', () => { if (i === idx) nextVideo(); });
  });

  // Fallback: if video doesn't fire ended, rotate every 10s
  setInterval(() => {
    if (vids[idx].paused || vids[idx].ended) nextVideo();
  }, 10000);
})();

// === SCROLL PROGRESS ===
const progressBar = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
  document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 60);
});

// === REVEAL ON SCROLL ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

// === LIGHTBOX ===
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
const imgs = Array.from(document.querySelectorAll('.gallery-item img, .outro-card-img img'));
let current = 0;

function openLightbox(idx) {
  current = idx;
  lbImg.src = imgs[idx].src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
function shiftLightbox(dir) {
  current = (current + dir + imgs.length) % imgs.length;
  lbImg.style.opacity = 0;
  setTimeout(() => { lbImg.src = imgs[current].src; lbImg.style.opacity = 1; }, 200);
}

document.querySelectorAll('.gallery-item, .outro-card-img').forEach((el, i) => {
  el.addEventListener('click', () => openLightbox(i));
});
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => shiftLightbox(-1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => shiftLightbox(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') shiftLightbox(-1);
  if (e.key === 'ArrowRight') shiftLightbox(1);
});
lbImg.style.transition = 'opacity 0.2s';

// === GALLERY OPEN BUTTON ===
const openGalleryBtn = document.getElementById('openGalleryBtn');
if (openGalleryBtn) {
  openGalleryBtn.addEventListener('click', () => openLightbox(0));
}

// === HAMBURGER MENU ===
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}
