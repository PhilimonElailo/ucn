const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const toggle = document.querySelector('[data-nav-toggle]');

const syncHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  header.classList.toggle('is-open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

nav.addEventListener('click', (event) => {
  const link = event.target.closest('a');

  if (!link) {
    return;
  }

  const targetId = link.getAttribute('href');

  if (targetId && targetId.startsWith('#')) {
    event.preventDefault();

    const target = document.querySelector(targetId);

    if (target) {
      const offset = header.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }

  nav.classList.remove('is-open');
  header.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
});

/* ===== Lightbox ===== */
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImg = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxClose = document.querySelector('[data-lightbox-close]');
const lightboxPrev = document.querySelector('[data-lightbox-prev]');
const lightboxNext = document.querySelector('[data-lightbox-next]');
const galleryItems = document.querySelectorAll('[data-gallery-item]');

let currentIndex = 0;

const openLightbox = (index) => {
  const items = [...galleryItems];
  if (index < 0 || index >= items.length) return;
  currentIndex = index;

  const item = items[currentIndex];
  const img = item.querySelector('[data-gallery-img]');
  const captionEl = item.querySelector('.gallery-caption span:last-child');

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = captionEl ? captionEl.textContent : '';
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
};

const navigateLightbox = (direction) => {
  const items = [...galleryItems];
  let next = currentIndex + direction;
  if (next < 0) next = items.length - 1;
  if (next >= items.length) next = 0;
  openLightbox(next);
};

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
