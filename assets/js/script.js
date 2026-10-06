// =========================================================
// SafeLab Business Website - shared interactions (TB1 develop)
// Consolidated from front-section, engagement, i18n and site-quality.
// =========================================================

const topbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.mobile-toggle');
const mobilePanel = document.querySelector('.mobile-panel');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function translate(key, fallback, params) {
  if (!window.SafeLabI18n) return fallback;
  const value = window.SafeLabI18n.t(key, params);
  return value === key ? fallback : value;
}

function getTopbarOffset() {
  return topbar ? topbar.offsetHeight + 16 : 104;
}

function setMobileMenu(open) {
  if (!mobileToggle || !mobilePanel) return;
  mobilePanel.classList.toggle('open', open);
  mobileToggle.setAttribute('aria-expanded', String(open));
  mobileToggle.setAttribute(
    'aria-label',
    open
      ? translate('nav.closeMenu', 'Close navigation menu')
      : translate('nav.openMenu', 'Open navigation menu')
  );
  document.body.classList.toggle('mobile-menu-open', open);
}

if (mobileToggle && mobilePanel) {
  mobileToggle.addEventListener('click', () => {
    setMobileMenu(mobileToggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMobileMenu(false);
  });
  document.addEventListener('click', (event) => {
    if (!mobilePanel.classList.contains('open')) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!mobilePanel.contains(target) && !mobileToggle.contains(target)) setMobileMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) setMobileMenu(false);
  });
}

function scrollToHashTarget(hash, updateHistory = true) {
  if (!hash || hash === '#') return;
  const target = document.querySelector(hash);
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.scrollY - getTopbarOffset();
  window.scrollTo({ top: Math.max(0, y), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  if (updateHistory) history.pushState(null, '', hash);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || !document.querySelector(href)) return;
    event.preventDefault();
    setMobileMenu(false);
    scrollToHashTarget(href, true);
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) setTimeout(() => scrollToHashTarget(window.location.hash, false), 40);
});

// Active desktop navigation state.
const primaryLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
const observedSections = primaryLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
if ('IntersectionObserver' in window && observedSections.length) {
  const activeSectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    primaryLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.05, 0.2] });
  observedSections.forEach((section) => activeSectionObserver.observe(section));
}

// Reveal-on-scroll.
const revealItems = document.querySelectorAll('.reveal-up');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

// Testimonials carousel.
const cards = Array.from(document.querySelectorAll('.testimonials .testimonial-card'));
const track = document.querySelector('.testimonials [data-carousel-track]');
const dotsContainer = document.querySelector('.testimonials [data-carousel-dots]');
const prevButton = document.querySelector('.testimonials .carousel-arrow--left');
const nextButton = document.querySelector('.testimonials .carousel-arrow--right');
let currentIndex = 0;
let carouselInterval;

function buildDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', translate('testimonials.goTo', `Go to testimonial ${index + 1}`, { n: index + 1 }));
    dot.addEventListener('click', () => { goToSlide(index); resetAutoPlay(); });
    dotsContainer.appendChild(dot);
  });
}
function updateCarousel() {
  cards.forEach((card, index) => {
    const active = index === currentIndex;
    card.classList.toggle('is-active', active);
    card.setAttribute('aria-hidden', String(!active));
  });
  dotsContainer?.querySelectorAll('button').forEach((dot, index) => dot.classList.toggle('is-active', index === currentIndex));
}
function goToSlide(index) {
  if (!cards.length) return;
  currentIndex = (index + cards.length) % cards.length;
  updateCarousel();
}
function nextSlide() { goToSlide(currentIndex + 1); }
function prevSlide() { goToSlide(currentIndex - 1); }
function startAutoPlay() {
  if (cards.length < 2 || prefersReducedMotion) return;
  clearInterval(carouselInterval);
  carouselInterval = setInterval(nextSlide, 4800);
}
function resetAutoPlay() { clearInterval(carouselInterval); startAutoPlay(); }
if (cards.length) {
  buildDots(); updateCarousel(); startAutoPlay();
  nextButton?.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
  prevButton?.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  track?.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  track?.addEventListener('mouseleave', startAutoPlay);
  document.querySelector('.testimonials .testimonial-shell')?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
    if (event.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
  });
}

// FAQ accordion: one item open at a time.
const faqItems = document.querySelectorAll('.faq__list details');
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => { if (other !== item) other.open = false; });
  });
});

// Contact form local validation (no backend connected in the business website).
const contactForm = document.querySelector('.contact-form');
const contactRules = {
  name: (value) => value.length >= 2 ? '' : translate('validation.name', 'Please enter your name.'),
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : translate('validation.email', 'Please enter a valid email address.'),
  organization: (value) => value.length >= 2 ? '' : translate('validation.organization', 'Please enter your organization.'),
  interest: (value) => value ? '' : translate('validation.interest', 'Please choose a service.'),
  message: (value) => value.length >= 10 ? '' : translate('validation.message', 'Please write at least 10 characters.')
};
function validateField(field) {
  const rule = contactRules[field.name];
  if (!rule) return true;
  const message = rule(field.value.trim());
  const errorElement = document.getElementById(`${field.id}-error`);
  field.classList.toggle('is-invalid', Boolean(message));
  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (errorElement) errorElement.textContent = message;
  return !message;
}
if (contactForm) {
  const fields = Array.from(contactForm.querySelectorAll('input, select, textarea'));
  const formStatus = contactForm.querySelector('.form-status');
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => { if (field.classList.contains('is-invalid')) validateField(field); });
  });
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = fields.map(validateField).every(Boolean);
    if (formStatus) {
      formStatus.textContent = valid
        ? translate('validation.success', 'Thank you! Your message was sent. Our team will contact you soon.')
        : translate('validation.review', 'Please review the highlighted fields.');
      formStatus.classList.toggle('is-success', valid);
      formStatus.classList.toggle('is-error', !valid);
    }
    if (valid) {
      contactForm.reset();
      fields.forEach((field) => { field.classList.remove('is-invalid'); field.removeAttribute('aria-invalid'); });
    } else {
      fields.find((field) => field.classList.contains('is-invalid'))?.focus();
    }
  });
}

// Language switch.
const languageButtons = document.querySelectorAll('[data-lang-switch]');
languageButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    if (!window.SafeLabI18n) return;
    button.disabled = true;
    await window.SafeLabI18n.toggleLanguage();
    button.disabled = false;
  });
});

document.addEventListener('safelab:languagechange', () => {
  dotsContainer?.querySelectorAll('button').forEach((dot, index) => {
    dot.setAttribute('aria-label', translate('testimonials.goTo', `Go to testimonial ${index + 1}`, { n: index + 1 }));
  });
  if (mobileToggle) {
    mobileToggle.setAttribute('aria-label', translate('nav.openMenu', 'Open navigation menu'));
  }
});

// Functional light/dark theme shared by desktop and mobile controls.
const THEME_KEY = 'safelab-theme';
const themeButtons = document.querySelectorAll('[data-theme-switch]');
function applyTheme(theme) {
  const dark = theme === 'dark';
  document.body.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  themeButtons.forEach((button) => {
    button.textContent = dark ? '☾' : '☼';
    button.setAttribute('aria-pressed', String(dark));
  });
  try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (_) {}
}
let initialTheme = 'light';
try {
  initialTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch (_) {}
applyTheme(initialTheme);
themeButtons.forEach((button) => button.addEventListener('click', () => applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark')));
