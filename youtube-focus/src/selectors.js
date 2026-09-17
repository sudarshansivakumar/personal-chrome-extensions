// YouTube's custom elements are more stable than its generated class names.
// Keep page-specific selectors here so maintenance is localized if YouTube changes.
(function exposeSelectors() {
  globalThis.YouTubeFocusSelectors = {
    shortsShelves: [
      'ytd-reel-shelf-renderer',
      'ytd-rich-shelf-renderer',
      'ytd-rich-section-renderer',
      'ytm-reel-shelf-renderer'
    ],
    shortsCards: [
      'ytd-reel-item-renderer',
      'ytd-rich-item-renderer',
      'ytd-video-renderer',
      'ytd-grid-video-renderer',
      'ytd-compact-video-renderer',
      'ytd-guide-entry-renderer',
      'ytm-shorts-lockup-view-model'
    ],
    studyHidden: [
      '#comments',
      'ytd-comments',
      '#chat',
      'ytd-live-chat-frame',
      'ytd-live-chat-renderer',
      '#secondary #related',
      '#secondary ytd-watch-next-secondary-results-renderer',
      '#secondary ytd-compact-autoplay-renderer',
      '#movie_player .ytp-endscreen-content',
      '#movie_player .ytp-ce-element'
    ],
    homeFeed: [
      'ytd-browse[page-subtype="home"] #contents',
      'ytd-browse[page-subtype="home"] #primary #contents'
    ]
  };
})();
