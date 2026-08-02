<div align="center">
  <img src="docs/assets/logo.png" alt="Universal Downloader" width="128" height="128" />

  <h1>Universal Downloader</h1>

  <p><strong>A fast, minimal desktop app for downloading video and audio from the web.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
    <img src="https://img.shields.io/badge/Tauri-2-24C8DB.svg?logo=tauri" alt="Tauri 2" />
    <img src="https://img.shields.io/badge/React-18-61DAFB.svg?logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Rust-stable-000000.svg?logo=rust" alt="Rust" />
    <img src="https://img.shields.io/badge/tests-131%20passing-brightgreen.svg" alt="131 tests passing" />
  </p>
</div>

---

> **Note on screenshots:** the image placeholders below point to `docs/assets/`.
> Add real captures there to have them render — see
> [docs/assets/README.md](docs/assets/README.md).

## Overview

Universal Downloader is a desktop application for downloading media from the
web. Paste a link, review the metadata, pick a format and quality, and
download — with a real queue, live progress, history, and sensible defaults.
It wraps [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) and
[`ffmpeg`](https://ffmpeg.org/) behind a clean, minimal interface, so the full
power of those tools is available without the command line.

The app is built with [Tauri 2](https://v2.tauri.app/) — a Rust backend with a
web frontend rendered in the OS-native webview — which keeps the binary small
and the memory footprint low compared with Electron.

<div align="center">
  <img src="docs/assets/screenshot-main.png" alt="Main screen" width="720" />
</div>

## Features

- **Paste-and-go** — the URL field is the hero; paste a link and metadata
  (title, uploader, duration, thumbnail, available formats) loads automatically.
- **Format & quality selection** — choose the exact format, or let a quality
  preset (best / best-compatible / smallest) pick for you.
- **Audio extraction** — download audio-only in your preferred format and bitrate.
- **Subtitles** — download or embed subtitles, including auto-generated ones,
  in the languages you choose.
- **Download queue** — a coordinator caps concurrency at a configurable limit;
  extra downloads wait and start automatically as slots free up.
- **Live progress** — per-download progress, speed, ETA, and the current
  pipeline phase (downloading → merging → finalizing), parsed from yt-dlp's output.
- **Pause / resume / cancel / retry** — full control over each download, with
  automatic retry-with-backoff for transient failures.
- **History** — finished downloads are recorded and searchable in an overlay.
- **Desktop integration** — system tray, start-at-login, minimize-to-tray,
  drag-and-drop of links, and an opt-in clipboard watcher.
- **Native notifications** — optional desktop notifications on completion or failure.
- **Diagnostics** — a built-in panel reports the detected yt-dlp / ffmpeg
  versions and lets you inspect logs.
- **Minimal, animated UI** — one main screen, settings and history as overlays,
  and a single consistent motion system.

For the full details of each area, see the [documentation](#documentation).

## Technologies

| Layer          | Stack                                                        |
| -------------- | ------------------------------------------------------------ |
| Backend        | Rust, Tauri 2, `tauri-plugin-*` (shell, fs, dialog, store, notification, clipboard, os, process, updater, window-state, autostart, opener) |
| Frontend       | React 18, TypeScript 5, Vite 5                               |
| State          | Zustand                                                      |
| Styling        | Tailwind CSS, CSS design tokens                              |
| Animation      | Framer Motion                                                |
| Media tooling  | `yt-dlp`, `ffmpeg` (invoked by the Rust backend)             |
| Testing        | Vitest                                                       |

## Architecture

```
src/                      Frontend (React + TypeScript)
  app/                    App shell; mounts global subscriptions and overlays
  core/engine/            Framework-agnostic engine: event bus, errors,
                          persistence, history store, platform/URL resolvers
  modules/
    downloads/            Download queue, cards, actions, progress
    metadata/             Metadata resolution, ranking, cache
    advanced/             yt-dlp args builder, template & retry logic, options
    settings/             Settings store, migration, overlay UI
    desktop/              Tray, drag & drop, clipboard, notifications,
                          diagnostics, crash recovery, updater
  shared/                 Reusable UI components and utilities
  design-system/          Motion system and design tokens
  styles/                 Global CSS

src-tauri/                Backend (Rust)
  src/
    lib.rs                Bootstrap + command registration
    commands.rs           probe_media, download_media, stop_download, open_path
    diagnostics.rs        yt-dlp / ffmpeg version reporting
    tray.rs               System tray
  capabilities/           Permission set for the main window
  icons/                  App icons (all platforms)
```

The guiding rule: **business logic never lives in components** — it belongs to
hooks, services, or stores. See [docs/architecture.md](docs/architecture.md)
for the full picture.

## Requirements

- **Node.js 20+** and **pnpm 9+**
- **Rust** (stable) with the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your OS
- **`yt-dlp`** and **`ffmpeg`** available on your PATH (the backend runs them):
  - macOS: `brew install yt-dlp ffmpeg`
  - Windows: `winget install yt-dlp.yt-dlp Gyan.FFmpeg`
  - Linux: your package manager, or `pipx install yt-dlp` + `apt install ffmpeg`

> The app also searches common install locations, so it usually finds yt-dlp
> and ffmpeg even if they aren't on a GUI app's PATH. You can always set explicit
> paths in **Settings → Developer**.

## Installation

Pre-built installers are produced by the release pipeline for Windows, macOS
and Linux. See [docs/installation.md](docs/installation.md) for per-platform
instructions and the supported package formats.

## Development

```bash
pnpm install          # install dependencies
pnpm tauri dev        # run the desktop app in dev mode
```

Common scripts:

```bash
pnpm typecheck        # TypeScript, no emit
pnpm lint             # ESLint (zero warnings allowed)
pnpm test:run         # unit tests once
pnpm check            # typecheck + lint + tests
pnpm doctor           # check + production build
```

See [docs/development.md](docs/development.md) for the full workflow.

## Configuration

All settings live in the in-app **Settings** overlay, grouped into **General**,
**Advanced**, and **Developer**. Every option and every download flag is
documented in [docs/settings.md](docs/settings.md).

## Build

```bash
pnpm tauri build      # produce installers for the current platform
```

Full details, including the release profile and per-platform bundle formats,
are in [docs/build.md](docs/build.md).

## Documentation

| Document | Covers |
| -------- | ------ |
| [installation.md](docs/installation.md) | Installing on each platform |
| [development.md](docs/development.md) | Local setup, scripts, conventions |
| [build.md](docs/build.md) | Building and packaging installers |
| [architecture.md](docs/architecture.md) | How the codebase fits together |
| [settings.md](docs/settings.md) | Every setting and download option |
| [download-engine.md](docs/download-engine.md) | Queue, progress, retry, phases |
| [metadata-engine.md](docs/metadata-engine.md) | Probing, ranking, caching |
| [desktop-integration.md](docs/desktop-integration.md) | Tray, drag & drop, clipboard, notifications, updater |
| [troubleshooting.md](docs/troubleshooting.md) | Fixing common problems |
| [faq.md](docs/faq.md) | Frequently asked questions |

## Troubleshooting

The most common issue is a download that fails immediately, which almost always
means yt-dlp or ffmpeg can't be found. See
[docs/troubleshooting.md](docs/troubleshooting.md) for that and other fixes.

## Roadmap

These are directions the codebase is structured to support. They are **not yet
implemented** and are listed here as intent, not as existing features:

- Bundling yt-dlp / ffmpeg as sidecars, so no separate install is needed.
- Enabling the auto-updater (the plumbing exists; it needs signing keys and an
  endpoint — see [docs/desktop-integration.md](docs/desktop-integration.md#updater)).
- Playlist download as a first-class flow.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for
the project structure, conventions, and pull-request process.

## Security

To report a vulnerability, see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 Kai

## Credits

- [Tauri](https://tauri.app/) — the desktop framework.
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) — the media downloader this app wraps.
- [ffmpeg](https://ffmpeg.org/) — media processing and merging.
- Icons and UI built with [Lucide](https://lucide.dev/) and [Tailwind CSS](https://tailwindcss.com/).
