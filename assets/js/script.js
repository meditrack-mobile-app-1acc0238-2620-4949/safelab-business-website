// =========================================================
// SafeLab Business Website - shared interactions
// Front section: responsive navigation + smooth in-page access
// =========================================================

const topbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.mobile-toggle');
const mobilePanel = document.querySelector('.mobile-panel');

function getTopbarOffset() {
  return topbar ? topbar.offsetHeight + 16 : 104;
}

function closeMobileMenu() {
  if (!mobileToggle || !mobilePanel) return;
  mobilePanel.classList.remove('open');
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-label', 'Open navigation menu');
  document.body.classList.remove('mobile-menu-open');
}

function openMobileMenu() {
  if (!mobileToggle || !mobilePanel) return;
  mobilePanel.classList.add('open');
  mobileToggle.setAttribute('aria-expanded', 'true');
  mobileToggle.setAttribute('aria-label', 'Close navigation menu');
  document.body.classList.add('mobile-menu-open');
}

if (mobileToggle && mobilePanel) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!mobilePanel.classList.contains('open')) return;
    if (mobilePanel.contains(target) || mobileToggle.contains(target)) return;
    closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) closeMobileMenu();
  });
}

function scrollToHashTarget(hash, updateHistory = true) {
  if (!hash || hash === '#') return;

  const target = document.querySelector(hash);
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.scrollY - getTopbarOffset();
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });

  if (updateHistory) {
    history.pushState(null, '', hash);
  }
}

// Smooth navigation for every internal section link, including navbar,
// mobile menu, hero CTAs and footer navigation.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    closeMobileMenu();
    scrollToHashTarget(href, true);
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) {
    setTimeout(() => scrollToHashTarget(window.location.hash, false), 40);
  }
});

// Highlight the active top-level section without changing the URL.
const primaryLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
const observedSections = primaryLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      primaryLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    },
    {
      rootMargin: '-22% 0px -62% 0px',
      threshold: [0, 0.05, 0.2]
    }
  );

  observedSections.forEach((section) => activeSectionObserver.observe(section));
}

// Reveal-on-scroll animation.
const revealItems = document.querySelectorAll('.reveal-up');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

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
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });
}

function updateCarousel() {
  cards.forEach((card, index) => {
    card.classList.toggle('is-active', index === currentIndex);
  });

  const dots = dotsContainer ? dotsContainer.querySelectorAll('button') : [];
  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === currentIndex);
  });
}

function goToSlide(index) {
  if (!cards.length) return;
  currentIndex = (index + cards.length) % cards.length;
  updateCarousel();
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

function startAutoPlay() {
  if (cards.length < 2 || prefersReducedMotion) return;
  clearInterval(carouselInterval);
  carouselInterval = setInterval(nextSlide, 4800);
}

function resetAutoPlay() {
  clearInterval(carouselInterval);
  startAutoPlay();
}

if (cards.length) {
  buildDots();
  updateCarousel();
  startAutoPlay();

  nextButton?.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  prevButton?.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  track?.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  track?.addEventListener('mouseleave', startAutoPlay);
}

// Prototype form: prevent an accidental full-page refresh until a real
// submission service is connected by the corresponding implementation task.
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}
