# Architecture

How the codebase is organised and how data flows from a pasted URL to a
finished download.

## Table of contents

- [High-level shape](#high-level-shape)
- [Frontend structure](#frontend-structure)
- [Backend structure](#backend-structure)
- [The engine](#the-engine)
- [Frontend ↔ backend bridge](#frontend--backend-bridge)
- [Guiding rules](#guiding-rules)

## High-level shape

Universal Downloader is a Tauri app: a **Rust backend** that runs `yt-dlp` and
`ffmpeg`, and a **React frontend** rendered in the OS webview. They communicate
over Tauri's command (request/response) and event (stream) channels.

```
┌──────────────────────────── Frontend (webview) ───────────────────────────┐
│  App shell → modules (downloads, metadata, advanced, settings, desktop)    │
│      │  invoke()                        ▲  events                          │
└──────┼──────────────────────────────────┼────────────────────────────────┘
       ▼                                  │
┌──────────────────────────── Backend (Rust) ──────────────────────────────┐
│  commands.rs ── spawns ──▶ yt-dlp ──▶ ffmpeg                              │
│      └── emits download://progress | phase | log events ─────────────────┘
└───────────────────────────────────────────────────────────────────────────┘
```

## Frontend structure

```
src/
  app/            App shell; mounts global subscriptions and overlays
  core/engine/    Framework-agnostic engine (see below)
  modules/
    downloads/    Queue, cards, actions, progress, persistence
    metadata/     Probe, format ranking, cache
    advanced/     yt-dlp args builder, template & retry logic, options store
    settings/     Settings store, migration, overlay UI
    desktop/      Tray, drag & drop, clipboard, notifications, diagnostics,
                  crash recovery, updater, window behaviour
  shared/         Reusable UI components + utilities
  design-system/  Motion system + design tokens
  styles/         Global CSS
```

Each module is self-contained, with `components/` (UI only), `hooks/`
(orchestration), `services/` (side effects / backend bridge), `stores/`
(Zustand state), and `types/` (shared contracts).

## Backend structure

```
src-tauri/src/
  lib.rs          Bootstrap: registers plugins, commands, tray; non-fatal setup
  commands.rs     probe_media, download_media, stop_download, open_path;
                  binary resolution, output parsing, process registry
  diagnostics.rs  yt_dlp_version, ffmpeg_version
  tray.rs         System tray menu and window show/hide
```

## The engine

`core/engine/` is the framework-agnostic core the UI talks to instead of the
provider directly:

- **controller/** — orchestrates sanitise → resolve platform → probe. The URL
  sanitizer strips tracking params and validates structure.
- **providers/** — `DownloadProvider` is the abstraction; `YtDlpProvider` is
  the only implementation. Swapping backends means implementing the interface.
- **platform/** — identifies the source platform; informative only.
- **events/** — `EngineEventMap` is the single source of truth for event names;
  the `EventBus` is strongly typed.
- **state/** — the download state machine; illegal transitions are impossible
  in correct code.
- **history/**, **persistence/** — the history store and disk persistence.

## Frontend ↔ backend bridge

Four Tauri commands and four events connect the two sides. They are verified to
match exactly (names, parameters):

**Commands** (frontend → backend):

| Command | Purpose |
| ------- | ------- |
| `probe_media` | Fetch metadata + formats for a URL |
| `download_media` | Run the download; returns the output file path |
| `stop_download` | Kill a download's process (pause/cancel) |
| `open_path` | Open a folder or file in the OS |

Plus `yt_dlp_version` / `ffmpeg_version` for diagnostics.

**Events** (backend → frontend):

| Event | Payload |
| ----- | ------- |
| `download://progress` | Percent, bytes, speed, ETA |
| `download://phase` | Current pipeline phase |
| `download://log` | A line of output (with level) |
| `tray://action` | A tray menu action |

## Guiding rules

- **Business logic never lives in components** — hooks, services, or stores own it.
- **The UI never talks to the provider directly** — it goes through the engine.
- **Types are shared contracts**, imported rather than duplicated.
- **No dead toggles** — a control ships only once it has a real effect.
