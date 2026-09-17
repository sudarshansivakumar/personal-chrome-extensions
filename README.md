# Personal Chrome Extensions

Small, private-by-default Chrome extensions built to solve specific everyday problems without analytics, accounts, subscriptions, or remote services.

## YouTube Focus

YouTube Focus keeps YouTube useful for deliberate learning while removing its most distracting surfaces.

### Features

- **Study Mode** hides comments, live chat, homepage recommendations, watch-page recommendations, and end-screen cards.
- **No Shorts** removes Shorts links, cards, and shelves across YouTube and blocks direct `/shorts/...` pages.
- Search, normal video results, descriptions, chapters, transcripts, captions, and playback controls remain available.
- Course playlists keep their panel, previous/next controls, and automatic progression.
- Settings update open YouTube tabs immediately and persist locally in Chrome.

### Install

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the [`youtube-focus`](youtube-focus) directory—the folder containing its `manifest.json`.
6. Optionally pin YouTube Focus from Chrome's extensions menu.

Click the toolbar icon to independently toggle **Study Mode** and **No Shorts**.

### Privacy and permissions

YouTube Focus runs only on `youtube.com` and requests Chrome storage access solely to remember the two toggles. It contains no analytics, remote code, third-party libraries, or network service.

### Known boundary

The extension intentionally does not classify Shorts opened through an ordinary `watch?v=...` URL. Explicit Shorts URLs and visible Shorts surfaces are blocked.

## Development

The extensions use plain Manifest V3 HTML, CSS, and JavaScript—there is no build step or package manager. After editing an extension, reload it from `chrome://extensions` and refresh the relevant tab.

See the [YouTube Focus README](youtube-focus/README.md) for project-specific details and [implementation plan](youtube-focus/PLAN.md) for design decisions and the manual test checklist.
