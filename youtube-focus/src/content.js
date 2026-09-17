(function youtubeFocusContent() {
  'use strict';

  const STORAGE_DEFAULTS = { studyMode: false, noShorts: false };
  const SELECTORS = globalThis.YouTubeFocusSelectors;
  let settings = { ...STORAGE_DEFAULTS };
  let scanTimer = 0;
  let blocker;

  function isYouTube() {
    return location.hostname === 'www.youtube.com' || location.hostname === 'youtube.com';
  }

  function isShortsPath() {
    return /^\/shorts(?:\/|$)/i.test(location.pathname);
  }

  function shouldBlockShorts() {
    return isShortsPath() && (settings.noShorts || settings.studyMode);
  }

  function ensureBlocker() {
    if (blocker || !document.body) return;

    blocker = document.createElement('div');
    blocker.id = 'yf-shorts-blocker';
    blocker.setAttribute('role', 'dialog');
    blocker.setAttribute('aria-label', 'Shorts blocked');
    blocker.innerHTML = `
      <div class="yf-blocker-card">
        <h1>Shorts are blocked.</h1>
        <p>This page is hidden by YouTube Focus. You can go back or search for something intentional to watch.</p>
        <div class="yf-blocker-actions">
          <button type="button" data-yf-action="back">Go back</button>
          <a href="/results" data-yf-action="search">Go to YouTube search</a>
        </div>
      </div>
    `;
    blocker.addEventListener('click', (event) => {
      const action = event.target.closest('[data-yf-action]')?.dataset.yfAction;
      if (action === 'back') history.back();
    });
    document.body.appendChild(blocker);
  }

  function updateBlocker() {
    if (!document.body) return;
    const blocked = shouldBlockShorts();
    document.body.classList.toggle('yf-shorts-blocked', blocked);
    if (blocked) ensureBlocker();
  }

  function closestShortsContainer(link) {
    // Prefer the whole dedicated shelf so its heading and menu disappear too.
    // Only fall back to an individual card when the Short is mixed into results.
    const shelf = link.closest(SELECTORS.shortsShelves.join(','));
    const card = link.closest(SELECTORS.shortsCards.join(','));
    return shelf || card || link;
  }

  function markShortsLinks() {
    if (!document.body) return;
    document.querySelectorAll('[data-yf-short-hidden="true"]').forEach((element) => {
      element.removeAttribute('data-yf-short-hidden');
    });

    const links = document.querySelectorAll('a[href^="/shorts"], a[href*="youtube.com/shorts"]');
    links.forEach((link) => closestShortsContainer(link).setAttribute('data-yf-short-hidden', 'true'));
  }

  function applyPageState() {
    if (!document.body || !isYouTube()) return;
    document.body.classList.toggle('yf-study-mode', settings.studyMode);
    document.body.classList.toggle('yf-no-shorts', settings.noShorts || settings.studyMode);
    document.body.dataset.yfRoute = location.pathname;
    updateBlocker();
    markShortsLinks();
  }

  function scheduleApply() {
    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(applyPageState, 120);
  }

  function loadSettings() {
    chrome.storage.local.get(STORAGE_DEFAULTS, (stored) => {
      settings = {
        studyMode: Boolean(stored.studyMode),
        noShorts: Boolean(stored.noShorts)
      };
      applyPageState();
    });
  }

  function listenForNavigation() {
    ['yt-navigate-start', 'yt-navigate-finish', 'yt-page-data-updated', 'popstate'].forEach((eventName) => {
      document.addEventListener(eventName, scheduleApply, true);
      window.addEventListener(eventName, scheduleApply, true);
    });
  }

  function watchForDynamicContent() {
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.addedNodes.length > 0)) scheduleApply();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init() {
    if (!isYouTube()) return;
    listenForNavigation();
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return;
      if (changes.studyMode) settings.studyMode = Boolean(changes.studyMode.newValue);
      if (changes.noShorts) settings.noShorts = Boolean(changes.noShorts.newValue);
      applyPageState();
    });
    if (document.body) {
      watchForDynamicContent();
      loadSettings();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        watchForDynamicContent();
        loadSettings();
      }, { once: true });
    }
  }

  init();
})();
