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
const mobileToggle = document.querySelector(".mobile-toggle");
const mobilePanel = document.querySelector(".mobile-panel");

if (mobileToggle && mobilePanel) {
  mobileToggle.addEventListener("click", () => {
    mobilePanel.classList.toggle("open");
  });

  mobilePanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobilePanel.classList.remove("open");
    });
  });
}

// ---------------------------------------------------------
// 2) Reveal on scroll
// Base from both previous files, unified in one observer
// Affects elements with:
// - .reveal-up
// ---------------------------------------------------------
const revealItems = document.querySelectorAll(".reveal-up");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 },
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
const cards = Array.from(
  document.querySelectorAll(".testimonials .testimonial-card"),
);
const track = document.querySelector(".testimonials [data-carousel-track]");
const dotsContainer = document.querySelector(
  ".testimonials [data-carousel-dots]",
);
const prevButton = document.querySelector(
  ".testimonials .carousel-arrow--left",
);
const nextButton = document.querySelector(
  ".testimonials .carousel-arrow--right",
);

let currentIndex = 0;

// Uses the i18n module when it is loaded; otherwise keeps the English fallback.
function translate(key, fallback, params) {
  if (!window.SafeLabI18n) return fallback;
  const value = window.SafeLabI18n.t(key, params);
  return value === key ? fallback : value;
}
let carouselInterval;

function buildDots() {
  if (!dotsContainer) return;

  dotsContainer.innerHTML = "";

  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute(
      "aria-label",
      translate("testimonials.goTo", `Go to testimonial ${index + 1}`, {
        n: index + 1,
      }),
    );
    dot.addEventListener("click", () => {
      goToSlide(index);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });
}

function updateCarousel() {
  cards.forEach((card, index) => {
    card.classList.toggle("is-active", index === currentIndex);
  });

  const dots = dotsContainer ? dotsContainer.querySelectorAll("button") : [];
  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentIndex);
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

  nextButton?.addEventListener("click", () => {
    nextSlide();
    resetAutoPlay();
  });

  prevButton?.addEventListener("click", () => {
    prevSlide();
    resetAutoPlay();
  });

  track?.addEventListener("mouseenter", () => clearInterval(carouselInterval));
  track?.addEventListener("mouseleave", startAutoPlay);
}

// ---------------------------------------------------------
// 5) Form behavior placeholder
// Small UX safeguard so the placeholder form does not refresh
// the page while still looking functional in the prototype.
// ---------------------------------------------------------
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

// ---------------------------------------------------------
// 5) Sticky-topbar anchor correction
// Ensures each topbar link lands with the section title visible,
// matching the earlier reference behavior.
// ---------------------------------------------------------
const topbar = document.querySelector(".navbar");

function getTopbarOffset() {
  return topbar ? topbar.offsetHeight + 18 : 104;
}

function scrollToHashTarget(hash, updateHistory = true) {
  if (!hash || hash === "#") return;
  const target = document.querySelector(hash);
  if (!target) return;

  const y =
    target.getBoundingClientRect().top + window.scrollY - getTopbarOffset();
  window.scrollTo({ top: y, behavior: "smooth" });

  if (updateHistory) {
    history.replaceState(null, "", hash);
  }
}

document.querySelectorAll(".nav-menu a, .mobile-panel a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    event.preventDefault();
    if (mobilePanel) mobilePanel.classList.remove("open");
    scrollToHashTarget(href, true);
  });
});

window.addEventListener("load", () => {
  if (window.location.hash) {
    setTimeout(() => scrollToHashTarget(window.location.hash, false), 40);
  }
});

// ---------------------------------------------------------
// 6) Language switch (EN / ES)
// Connects the EN / ES buttons of the navbar and the mobile menu
// with the i18n module (assets/i18n/i18n.js).
// Affects:
// - [data-lang-switch] buttons in .nav-actions and .mobile-panel-actions
// - testimonial dots labels (generated by JavaScript)
// ---------------------------------------------------------
const languageButtons = document.querySelectorAll("[data-lang-switch]");

languageButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (!window.SafeLabI18n) return;
    button.disabled = true;
    await window.SafeLabI18n.toggleLanguage();
    button.disabled = false;
  });
});

document.addEventListener("safelab:languagechange", () => {
  if (!dotsContainer) return;
  dotsContainer.querySelectorAll("button").forEach((dot, index) => {
    dot.setAttribute(
      "aria-label",
      translate("testimonials.goTo", `Go to testimonial ${index + 1}`, {
        n: index + 1,
      }),
    );
  });
});
