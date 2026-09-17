# YouTube Focus

A small, local Chrome extension for making YouTube better for deliberate learning.

## What it does

- **Study Mode** hides comments, live chat, the homepage feed, watch-page recommendations, and end-screen recommendation cards.
- **No Shorts** hides Shorts links, shelves, and cards, and blocks explicit `/shorts/...` pages.
- The active playlist panel, search, video player, descriptions, chapters, transcripts, captions, and normal controls remain available.
- Both settings apply to open YouTube tabs and are saved locally in Chrome.

The first version intentionally does not try to identify a Short disguised as an ordinary `watch?v=...` URL.

## Install for personal use

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the `youtube-focus` folder (the folder containing `manifest.json`).
5. Pin the extension if you want quick access from the toolbar.

After changing the files, return to `chrome://extensions` and click the extension's reload button. Refresh any open YouTube tab if needed.

## Use

Click the YouTube Focus toolbar icon and turn on either switch. Study Mode and No Shorts are independent; Study Mode also hides Shorts while it is active.

## Privacy

The extension has no server, analytics, remote code, or third-party libraries. It only runs on YouTube and uses Chrome local storage for the two preferences.
