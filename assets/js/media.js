// SafeLab embedded videos and optional Android APK: no third-party player loads before a click.
(() => {
  'use strict';
  const config = window.SafeLabSiteConfig || {};
  const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/;
  const validHttpUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch (_) { return null; }
  };
  const i18n = (key, fallback) => {
    const translated = window.SafeLabI18n?.t(key);
    return translated && translated !== key ? translated : fallback;
  };

  // Route both variants of existing nav buttons through the configured Render deployment.
  document.querySelectorAll('[data-auth-link]').forEach((link) => {
    const kind = link.getAttribute('data-auth-link');
    const destination = validHttpUrl(kind === 'signup' ? config.signupUrl : config.loginUrl);
    if (destination) link.href = destination;
  });
  document.querySelectorAll('[data-webapp-link]').forEach((link) => {
    const destination = validHttpUrl(config.webAppUrl);
    if (destination) link.href = destination;
  });

  // Prefer a dedicated promotional video when supplied; never mislabel validation interviews.
  const isProductVideo = youtubeIdPattern.test(config.productVideoId || '');
  const videoIds = {
    product: isProductVideo ? config.productVideoId : config.validationVideoId,
    team: config.teamVideoId,
  };
  const videoFrames = document.querySelectorAll('[data-youtube-player]');
  videoFrames.forEach((frame) => {
    const kind = frame.getAttribute('data-youtube-player');
    const id = videoIds[kind];
    if (!youtubeIdPattern.test(id || '')) return;
    frame.dataset.videoId = id;
    const source = document.querySelector(`[data-video-external="${kind}"]`);
    if (source) source.href = `https://youtu.be/${id}`;
    const playButton = frame.querySelector('.cinema-play');
    if (!playButton) return;
    playButton.addEventListener('click', () => {
      if (frame.classList.contains('is-playing')) return;
      const iframe = document.createElement('iframe');
      iframe.className = 'cinema-iframe';
      iframe.title = kind === 'team'
        ? i18n('video.team.play', 'SafeLab About the Team')
        : (isProductVideo
          ? i18n('video.product.play', 'SafeLab About the Product')
          : i18n('video.product.playValidation', 'SafeLab validation interviews'));
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.appendChild(iframe);
      frame.classList.add('is-playing');
      playButton.setAttribute('aria-hidden', 'true');
      playButton.tabIndex = -1;
      iframe.focus();
    });
  });
  const productLabel = document.querySelector('[data-video-product-type]');
  if (isProductVideo && productLabel) {
    const productPlay = document.querySelector('[data-youtube-player="product"] .cinema-play');
    if (productPlay) {
      productPlay.setAttribute('data-i18n-aria-label', 'video.product.play');
      productPlay.setAttribute('aria-label', i18n('video.product.play', 'Play SafeLab product video'));
    }
    productLabel.setAttribute('data-i18n', 'video.product.labelProduct');
    productLabel.textContent = i18n('video.product.labelProduct', 'About the Product');
  }

  const backdrop = document.querySelector('[data-download-backdrop]');
  const dialog = document.querySelector('[data-download-dialog]');
  const closeButton = document.querySelector('[data-download-close]');
  const triggers = document.querySelectorAll('[data-download-open]');
  const apkLink = document.querySelector('[data-download-apk]');
  const repo = typeof config.githubReleaseRepository === 'string'
    ? config.githubReleaseRepository.trim() : '';
  const releaseApkName = typeof config.githubReleaseApkName === 'string'
    ? config.githubReleaseApkName.trim() : '';
  const validRepo = /^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9._-]+$/.test(repo);
  const validApkName = /^[A-Za-z0-9][A-Za-z0-9._-]*\.apk$/i.test(releaseApkName);
  const latestApkUrl = validRepo && validApkName
    ? `https://github.com/${repo}/releases/latest/download/${encodeURIComponent(releaseApkName)}`
    : null;
  const apkUrl = validHttpUrl(config.apkDownloadUrl) || latestApkUrl;
  let previousFocus = null;
  if (apkLink && apkUrl) {
    apkLink.href = apkUrl;
    apkLink.removeAttribute('hidden');
  }

  const close = () => {
    if (!backdrop || backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.classList.remove('download-modal-open');
    previousFocus?.focus?.();
  };
  const open = () => {
    if (!backdrop || !dialog) return;
    previousFocus = document.activeElement;
    backdrop.hidden = false;
    document.body.classList.add('download-modal-open');
    closeButton?.focus();
  };
  triggers.forEach((trigger) => trigger.addEventListener('click', open));
  closeButton?.addEventListener('click', close);
  backdrop?.addEventListener('click', (event) => { if (event.target === backdrop) close(); });
  document.addEventListener('keydown', (event) => {
    if (!backdrop || backdrop.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('a[href]:not([hidden]), button:not([disabled]):not([hidden])')].filter(el => el.getClientRects().length);
    if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
