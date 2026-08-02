# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/), and the project aims to follow
[Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-07-31

The initial public release. Everything below is
implemented and tested (131 passing tests) unless explicitly marked otherwise.

### Core download flow

- Paste a URL to probe metadata (title, uploader, duration, thumbnail, formats)
  via `yt-dlp --dump-single-json`.
- Format selection grouped into Video+Audio / Video only / Audio only, ranked
  by resolution and bitrate, with size shown when known.
- Quality presets: best, best-compatible, smallest, or a manually chosen format.
- Download with live progress (percent, speed, ETA) streamed from the backend.
- Pipeline phases parsed from yt-dlp output (downloading → merging → finalizing).
- Output file path captured and used to open the exact file when done.

### Queue & reliability

- Concurrency-capped queue; extra downloads wait and start automatically.
- Pause, resume (with `--continue`), cancel, and retry per download.
- Automatic retry-with-backoff for transient failures only.
- Robust binary resolution: finds yt-dlp/ffmpeg in common install locations
  even when not on a GUI app's PATH.
- Probe socket timeout so an unresponsive host can't hang a card forever.

### Options (mapped to yt-dlp)

- Audio extraction with format and bitrate; metadata and thumbnail embedding.
- Subtitles: download or embed, chosen languages, auto-generated captions.
- Network: proxy, bandwidth limit, socket timeout, retry policy.
- Cookies: from a browser or a cookies file.
- Filename templates with validation.
- Playlist flags (skip-existing archive, end, reverse) — not yet a first-class
  flow.

### Settings

- Grouped settings (General / Advanced / Developer) in a Raycast-style overlay.
- Every setting has a real effect — no placeholder toggles.
- Versioned, migrating persistence that never breaks on old or corrupt data.
- JSON import/export via the clipboard.

### Metadata

- In-memory metadata cache with configurable TTL.
- Tolerant parsing that survives malformed individual formats.

### History

- Searchable history of finished downloads (completed and failed), with a
  configurable retention cap, shown in an overlay.

### Desktop integration

- System tray with show/hide/quit and a live queue tooltip.
- Start-at-login, start-minimized, minimize-to-tray, remember-window-state.
- Drag-and-drop of link-list files.
- Opt-in clipboard monitor with one-click add.
- Native notifications on completion/failure (opt-in), with in-app toasts.
- Diagnostics panel (detected yt-dlp/ffmpeg versions) and a log viewer.
- Crash recovery that offers to resume interrupted downloads.

### UI / UX

- Single main screen with settings and history as overlays.
- One consistent motion system; microinteractions and skeletons.
- Light/dark/system themes, density, and reduced-motion support.

### Build, CI/CD & packaging

- Tuned Rust release profile (size-optimised, LTO, stripped).
- Vite build with vendor chunk splitting.
- Bundle config for Windows (NSIS/MSI), macOS (app/DMG), Linux (deb/rpm/AppImage).
- GitHub Actions: CI, quality, CodeQL, security audits, and a multi-platform
  release workflow. Dependabot for npm, cargo, and actions.

### Not yet active (prepared)

- **Auto-updater** — plumbing wired; needs signing keys and an endpoint.
- **Code signing / notarisation** — release workflow references the secrets;
  builds are currently unsigned.
- **yt-dlp / ffmpeg bundling** — currently installed separately by the user.
