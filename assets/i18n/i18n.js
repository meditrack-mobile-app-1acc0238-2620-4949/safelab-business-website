// =========================================================
// SafeLab Landing Page - Internationalization (EN / ES)
// - English (en) is the default language.
// - Spanish (es) uses Latin American Spanish (html lang="es-419").
// - Texts live in assets/i18n/en.json and assets/i18n/es.json.
//
// HTML usage:
//   data-i18n="section.key"              -> replaces the element text
//   data-i18n-placeholder="section.key"  -> replaces the placeholder
//   data-i18n-aria-label="section.key"   -> replaces the aria-label
//   data-i18n-alt="section.key"          -> replaces the image alt
//   data-i18n-content="section.key"      -> replaces the meta content
//   data-lang-option="en" | "es"         -> highlights the active language
//
// Public API (window.SafeLabI18n):
//   setLanguage('en' | 'es'), toggleLanguage(), getLanguage(), t(key, params)
//   Event fired after every change: 'safelab:languagechange'
// =========================================================
(function () {
  const SUPPORTED_LANGUAGES = ['en', 'es'];
  const DEFAULT_LANGUAGE = 'en';
  const STORAGE_KEY = 'safelab-language';
  const HTML_LANG = { en: 'en', es: 'es-419' };
  const TRANSLATIONS_PATH = 'assets/i18n/';
  const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'aria-label', 'alt', 'title', 'content'];

  const dictionaries = {};
  let currentLanguage = DEFAULT_LANGUAGE;

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  function normalizeLanguage(lang) {
    if (!lang) return null;
    const short = String(lang).toLowerCase().slice(0, 2);
    return SUPPORTED_LANGUAGES.includes(short) ? short : null;
  }

  function readStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // Storage can be blocked (private mode); the site still works.
    }
  }

  function readQueryLanguage() {
    try {
      return new URLSearchParams(window.location.search).get('lang');
    } catch (error) {
      return null;
    }
  }

  function lookup(dictionary, key) {
    return key.split('.').reduce(
      (node, part) => (node && node[part] !== undefined ? node[part] : undefined),
      dictionary
    );
  }

  async function loadDictionary(lang) {
    if (dictionaries[lang]) return dictionaries[lang];
    const response = await fetch(`${TRANSLATIONS_PATH}${lang}.json`);
    if (!response.ok) throw new Error(`Could not load ${lang}.json (${response.status})`);
    dictionaries[lang] = await response.json();
    return dictionaries[lang];
  }

  // Returns the translated text, or undefined when the key does not exist.
  function resolve(key, params) {
    let value = lookup(dictionaries[currentLanguage] || {}, key);
    if (typeof value !== 'string') value = lookup(dictionaries[DEFAULT_LANGUAGE] || {}, key);
    if (typeof value !== 'string') return undefined;
    if (params) {
      Object.keys(params).forEach((name) => {
        value = value.split(`{${name}}`).join(params[name]);
      });
    }
    return value;
  }

  function t(key, params) {
    const value = resolve(key, params);
    return value === undefined ? key : value;
  }

  // ---------------------------------------------------------
  // Apply translations to the page
  // ---------------------------------------------------------
  function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = resolve(element.getAttribute('data-i18n'));
      if (value !== undefined) element.textContent = value;
    });

    TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
      root.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
        const value = resolve(element.getAttribute(`data-i18n-${attribute}`));
        if (value !== undefined) element.setAttribute(attribute, value);
      });
    });

    document.documentElement.setAttribute('lang', HTML_LANG[currentLanguage]);

    // Highlight the active option inside every EN / ES button
    document.querySelectorAll('[data-lang-option]').forEach((option) => {
      const isActive = option.getAttribute('data-lang-option') === currentLanguage;
      option.classList.toggle('is-active-language', isActive);
      option.style.opacity = isActive ? '1' : '0.45';
    });
  }

  // ---------------------------------------------------------
  // Language switching
  // ---------------------------------------------------------
  async function setLanguage(lang) {
    const nextLanguage = normalizeLanguage(lang) || DEFAULT_LANGUAGE;

    try {
      await loadDictionary(DEFAULT_LANGUAGE);
      await loadDictionary(nextLanguage);
    } catch (error) {
      // Opening index.html with file:// blocks fetch(). Use Live Server or GitHub Pages.
      console.warn('[SafeLab i18n] Translations could not be loaded:', error.message);
      return currentLanguage;
    }

    currentLanguage = nextLanguage;
    storeLanguage(nextLanguage);
    applyTranslations();
    document.dispatchEvent(
      new CustomEvent('safelab:languagechange', { detail: { language: nextLanguage } })
    );
    return nextLanguage;
  }

  function toggleLanguage() {
    return setLanguage(currentLanguage === 'en' ? 'es' : 'en');
  }

  window.SafeLabI18n = {
    supportedLanguages: SUPPORTED_LANGUAGES.slice(),
    getLanguage: () => currentLanguage,
    setLanguage,
    toggleLanguage,
    t,
    applyTranslations,
  };

  // Initial language: ?lang=es in the URL > saved preference > English
  const initialLanguage =
    normalizeLanguage(readQueryLanguage()) ||
    normalizeLanguage(readStoredLanguage()) ||
    DEFAULT_LANGUAGE;

  window.SafeLabI18n.ready = setLanguage(initialLanguage);
})();
