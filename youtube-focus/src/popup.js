(function youtubeFocusPopup() {
  'use strict';

  const defaults = { studyMode: false, noShorts: false };
  const studyToggle = document.querySelector('#study-mode');
  const shortsToggle = document.querySelector('#no-shorts');
  const status = document.querySelector('#status');

  function render(settings) {
    studyToggle.checked = Boolean(settings.studyMode);
    shortsToggle.checked = Boolean(settings.noShorts);
  }

  function save(key, value) {
    chrome.storage.local.set({ [key]: value }, () => {
      status.textContent = chrome.runtime.lastError ? 'Could not save the setting.' : 'Changes apply immediately.';
    });
  }

  chrome.storage.local.get(defaults, render);
  studyToggle.addEventListener('change', () => save('studyMode', studyToggle.checked));
  shortsToggle.addEventListener('change', () => save('noShorts', shortsToggle.checked));
})();
