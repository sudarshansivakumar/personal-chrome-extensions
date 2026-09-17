# YouTube Focus — Project Plan

## 1. What we are building

YouTube Focus will be a small personal Chrome extension that makes YouTube useful for deliberate learning without trying to turn it into a full productivity system.

It will have two independent switches:

1. **No Shorts** — removes access and invitations to YouTube Shorts.
2. **Study Mode** — removes distracting parts of ordinary YouTube while preserving search, course playlists, and learning tools.

The extension will work only on YouTube. It will not require an account, server, subscription, or access to browsing activity on other websites.

## 2. Final behavior

### No Shorts

This setting is independent of Study Mode, so it can remain enabled during normal YouTube use.

When enabled, it will:

- Hide Shorts links in YouTube's navigation.
- Hide Shorts shelves and carousels.
- Hide Shorts cards in search results, subscriptions, channel pages, and the homepage.
- Block explicit `youtube.com/shorts/...` pages with a simple full-page message and a button to go back.
- Reapply these rules as the user moves around YouTube without reloading the page.

Deliberate limitation: we will not attempt to identify a Short opened through an ordinary `watch?v=...` URL. This is an obscure edge case and is not worth adding brittle detection logic.

### Study Mode

When enabled, it will:

- Hide comments.
- Hide live chat.
- Hide unrelated recommendations beside and below a video.
- Hide the homepage recommendation feed.
- Hide end-screen recommendation cards inside the video player.
- Preserve the active playlist panel and navigation between videos in that playlist.
- Preserve automatic progression to the next video in the active playlist.
- Preserve YouTube search and ordinary video search results.
- Preserve descriptions, chapters, transcripts, captions, playback speed, and normal player controls.
- Preserve access to channels, subscriptions, and the user's library; these are intentional navigation paths rather than algorithmic recommendations.

If No Shorts is disabled while Study Mode is enabled, Study Mode will still hide Shorts because they are recommendations and distractions. In practice:

| Study Mode | No Shorts | Result |
|---|---|---|
| Off | Off | Normal YouTube |
| Off | On | Normal YouTube without Shorts |
| On | Off | Focused YouTube; Shorts hidden during Study Mode |
| On | On | Focused YouTube; Shorts remain blocked after leaving Study Mode |

This keeps the controls predictable: No Shorts is the permanent preference, while Study Mode temporarily includes it as part of the focused experience.

## 3. User experience

Clicking the extension icon will open a compact popup:

```text
YouTube Focus

Study Mode    [ toggle ]
No Shorts     [ toggle ]

Changes apply immediately.
```

Both preferences will be saved locally and restored when Chrome restarts. Changes will apply to every open YouTube tab without requiring a manual refresh.

When an explicit Shorts URL is blocked, the page will show:

```text
Shorts are blocked.

[ Go back ]  [ Go to YouTube search ]
```

The block screen should be calm and plain. It should not show a thumbnail, title, or teaser from the blocked Short.

## 4. Technical approach in plain English

YouTube behaves more like an app than a traditional website. Clicking a video often changes the page without fully reloading it. The extension therefore cannot run once and assume its work is finished.

The extension will use:

- A **Manifest V3 configuration file** to tell Chrome what the extension is and that it may run on YouTube.
- A **content script** that runs inside YouTube pages, reads the saved settings, detects navigation, and marks the page with the active modes.
- A **stylesheet** that hides known distracting YouTube components based on those page markers.
- A **small amount of JavaScript filtering** for Shorts cards that cannot be identified reliably with CSS alone.
- A **popup** containing the two switches.
- Chrome's local storage to remember the switches.

Most hiding will be done with CSS because it is fast and easy to repair. JavaScript will be reserved for navigation handling, settings updates, explicit Shorts blocking, and ambiguous Shorts containers.

## 5. Planned project structure

```text
youtube-focus/
├── PLAN.md
├── README.md
├── manifest.json
├── src/
│   ├── content.js
│   ├── selectors.js
│   ├── youtube.css
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

Responsibilities:

- `manifest.json`: Chrome extension metadata and narrowly scoped permissions.
- `content.js`: mode application, YouTube navigation detection, Shorts blocking, and communication with the popup.
- `selectors.js`: one centralized list of YouTube selectors so future YouTube changes are easy to repair.
- `youtube.css`: visual hiding rules for both modes.
- `popup.*`: the two-switch interface.
- `README.md`: simple installation, use, and troubleshooting instructions.

No framework, build system, package manager, or third-party JavaScript library is needed. Plain HTML, CSS, and JavaScript are sufficient and keep the extension easy to understand and maintain.

## 6. Permissions and privacy

The first version should request only:

- Access to `youtube.com` pages, so it can modify YouTube.
- Chrome storage, so it can remember the two settings.

It will not:

- Read or modify other websites.
- Send information anywhere.
- Track viewing activity.
- Contain analytics.
- Use remotely hosted code.
- Need the user's YouTube or Google credentials.

## 7. Handling YouTube changes

YouTube changes its page structure periodically, so complete permanence is unrealistic. We can make maintenance infrequent and straightforward:

- Keep all important selectors in `selectors.js` or clearly grouped sections of `youtube.css`.
- Prefer stable custom-element names such as YouTube renderer components over deeply nested class names.
- Identify Shorts using explicit `/shorts/` links where possible.
- Use multiple conservative selectors for important features such as comments and recommendations.
- Hide only a matched component, never a broad ancestor that might remove the video player or playlist.
- Add short comments explaining what each selector targets.
- Fail open for uncertain ordinary content, but fail closed for explicit `/shorts/` URLs.

## 8. Implementation phases

### Phase 1 — Extension shell

- Create the Manifest V3 configuration.
- Create the popup and both toggles.
- Store and restore preferences.
- Confirm the extension loads through `chrome://extensions`.

Success means the popup works and remembers both switches.

### Phase 2 — No Shorts

- Hide the Shorts sidebar link.
- Hide homepage and subscription Shorts shelves.
- Hide Shorts in search and channel results.
- Block direct `/shorts/...` navigation.
- Handle YouTube's in-page navigation.

Success means normal browsing presents no obvious path into Shorts.

### Phase 3 — Study Mode basics

- Hide comments and live chat.
- Hide the homepage feed.
- Hide watch-page recommendations and Up Next content.
- Hide end-screen recommendation cards.
- Ensure search and the player still work normally.

Success means a user can intentionally find and watch a video without algorithmic side paths.

### Phase 4 — Playlist preservation

- Test ordinary playlists and course playlists.
- Preserve the playlist panel.
- Preserve previous/next controls and playlist progression.
- Ensure recommendation selectors never hide playlist entries.

Success means an entire course can be followed in order with Study Mode enabled.

### Phase 5 — Polish and documentation

- Add clear icons and accessible labels.
- Prevent distracting content from briefly flashing during page load where practical.
- Write beginner-friendly installation and update instructions.
- Test after a fresh Chrome restart.

## 9. Test checklist

Each release should be checked manually in Chrome while signed both in and out of YouTube where practical.

### Toggle behavior

- Each switch works independently.
- Settings survive browser restart.
- Changing a switch updates already-open YouTube tabs.
- Disabling both switches restores normal YouTube without requiring extension removal.

### No Shorts

- No Shorts link appears in the sidebar.
- No Shorts shelf appears on the homepage.
- No Shorts shelf appears in subscriptions.
- Shorts are absent from search results.
- Shorts are absent from channel pages.
- A direct `/shorts/...` URL displays the block screen.
- Back and YouTube Search buttons on the block screen work.

### Study Mode

- Comments are hidden.
- Live chat is hidden.
- Homepage recommendations are hidden.
- Watch-page recommendations are hidden.
- End-screen recommendation cards are hidden.
- Search remains usable.
- Video playback and controls remain usable.
- Description, chapters, transcript, and captions remain usable.

### Playlists

- The active playlist panel remains visible.
- Clicking a playlist item works.
- Previous and next playlist buttons work.
- Automatic movement to the next playlist item works.
- Leaving a playlist does not leave behind broken page styling.

### Navigation and resilience

- Moving between Home, Search, a watch page, a channel, and a playlist applies the correct rules without refresh.
- Opening YouTube in a new tab applies the current settings immediately.
- No rule hides the main video player, search box, or account controls.

## 10. Known risks

### YouTube markup changes

The most likely failure is that YouTube renames or restructures a component. The centralized selector design limits the repair to a small part of the code.

### Brief content flashes

Chrome storage is read asynchronously, so a distracting section may appear briefly before being hidden. We will minimize this by loading the content script and base styles as early as Chrome permits.

### Ambiguous recommendations versus playlists

YouTube may use similar renderer components for both. Playlist preservation gets explicit tests and narrower selectors; we will not hide broad containers merely because they contain video links.

### Alternate YouTube layouts

YouTube experiments with layouts and may serve different structures to different accounts. The first version will target the normal desktop site. Mobile YouTube, embedded players, YouTube Music, and TV layouts are out of scope.

## 11. Version-one boundaries

Version one will intentionally not include:

- Time limits, streaks, or productivity statistics.
- Password-protected settings.
- Blocking YouTube entirely on a schedule.
- Keyword or channel blocking.
- Sponsor skipping.
- Mobile browser support.
- Firefox or Safari support.
- Chrome Web Store publication.
- Detection of Shorts disguised as ordinary `watch?v=...` links.

These can be reconsidered later, but none are necessary to solve the current problem.

## 12. Definition of done

Version one is done when:

1. The unpacked extension installs without errors.
2. Both switches are understandable and persist correctly.
3. Explicit Shorts surfaces and URLs are blocked as defined.
4. Study Mode removes comments and algorithmic recommendations.
5. Search and learning features remain available.
6. A course playlist can be completed from start to finish without disabling Study Mode.
7. The README lets a non-technical user install, use, update, and troubleshoot the extension.

## 13. Recommended next step

Build Phase 1 and Phase 2 first. This produces a useful No Shorts extension immediately and establishes the navigation machinery that Study Mode will reuse. Then add Study Mode and validate it against a real course playlist before polishing the interface.
