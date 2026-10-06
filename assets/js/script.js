// =========================================================
// SafeLab merged landing page - JS commented by behavior source
// Base interactions kept from the merged version and adjusted
// after the correction sketch.
// =========================================================

// ---------------------------------------------------------
// 1) Mobile navigation
// Base from file 1 / merged version
// Affects:
// - .mobile-toggle
// - .mobile-panel
// ---------------------------------------------------------
const mobileToggle = document.querySelector('.mobile-toggle');
const mobilePanel = document.querySelector('.mobile-panel');

if (mobileToggle && mobilePanel) {
  mobileToggle.addEventListener('click', () => {
    mobilePanel.classList.toggle('open');
  });

  mobilePanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobilePanel.classList.remove('open');
    });
  });
}

// ---------------------------------------------------------
// 2) Reveal on scroll
// Base from both previous files, unified in one observer
// Affects elements with:
// - .reveal-up
// ---------------------------------------------------------
const revealItems = document.querySelectorAll('.reveal-up');

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

// ---------------------------------------------------------
// 4) Testimonials carousel
// Logic adapted from the imported testimonial section
// Affects:
// - #testimonials .testimonial-card
// - #testimonials .carousel-dots
// - #testimonials .carousel-arrow--left / --right
// ---------------------------------------------------------
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
    const isActive = index === currentIndex;
    card.classList.toggle('is-active', isActive);
    card.setAttribute('aria-hidden', String(!isActive));
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
  if (cards.length < 2) return;
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

  // Keyboard support: left / right arrows when the carousel has focus
  const testimonialShell = document.querySelector('.testimonials .testimonial-shell');
  testimonialShell?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      prevSlide();
      resetAutoPlay();
    } else if (event.key === 'ArrowRight') {
      nextSlide();
      resetAutoPlay();
    }
  });
}

// ---------------------------------------------------------
// 5) FAQ accordion
// Keeps only one question open at a time
// Affects:
// - .faq__list details
// ---------------------------------------------------------
const faqItems = document.querySelectorAll('.faq__list details');

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

// ---------------------------------------------------------
// 6) Contact form validation
// Validates the required fields and shows visual feedback
// without refreshing the page (no backend connected yet).
// Affects:
// - .contact-form fields, .field-error and .form-status
// ---------------------------------------------------------
const contactForm = document.querySelector('.contact-form');

const contactRules = {
  name: (value) => (value.length >= 2 ? '' : 'Please enter your name.'),
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.',
  organization: (value) => (value.length >= 2 ? '' : 'Please enter your organization.'),
  interest: (value) => (value ? '' : 'Please choose a service.'),
  message: (value) => (value.length >= 10 ? '' : 'Please write at least 10 characters.')
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
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(field);
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const results = fields.map((field) => validateField(field));
    const isValid = results.every(Boolean);

    if (formStatus) {
      formStatus.textContent = isValid
        ? 'Thank you! Your message was sent. Our team will contact you soon.'
        : 'Please review the highlighted fields.';
      formStatus.classList.toggle('is-success', isValid);
      formStatus.classList.toggle('is-error', !isValid);
    }

    if (isValid) {
      contactForm.reset();
      fields.forEach((field) => {
        field.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
      });
    } else {
      fields.find((field) => field.classList.contains('is-invalid'))?.focus();
    }
  });
}

// ---------------------------------------------------------
// 7) Sticky-topbar anchor correction
// Ensures each topbar link lands with the section title visible,
// matching the earlier reference behavior.
// ---------------------------------------------------------
const topbar = document.querySelector('.navbar');

function getTopbarOffset() {
  return topbar ? topbar.offsetHeight + 18 : 104;
}

function scrollToHashTarget(hash, updateHistory = true) {
  if (!hash || hash === '#') return;
  const target = document.querySelector(hash);
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.scrollY - getTopbarOffset();
  window.scrollTo({ top: y, behavior: 'smooth' });

  if (updateHistory) {
    history.replaceState(null, '', hash);
  }
}

document.querySelectorAll('.nav-menu a, .mobile-panel a').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    event.preventDefault();
    if (mobilePanel) mobilePanel.classList.remove('open');
    scrollToHashTarget(href, true);
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) {
    setTimeout(() => scrollToHashTarget(window.location.hash, false), 40);
  }
});