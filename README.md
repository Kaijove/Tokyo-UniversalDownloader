<div align="center">

  <img src="docs/assets/logo.png" alt="Universal Downloader" width="200" />

  <h1>Universal Downloader</h1>

  <p><strong>Download anything. Simply.</strong></p>
  <p>A beautiful, fast and modern desktop downloader for video and audio from the web.</p>
<p align="center">
  <img src="https://img.shields.io/badge/🌸-No_Ads_·_No_Limits_·_All_Platforms_·_Infinite_Downloads_·_Maximum_Quality-ff2d90.svg?style=for-the-badge" alt="Features" />
</p>
  <br />

<img src="https://img.shields.io/badge/%F0%9F%8C%B8_Tokyo-night-ff2d90.svg" alt="Tokyo night" />
<img src="https://img.shields.io/badge/platforms-1000+-ec4899.svg" alt="1000+ platforms" />
<img src="https://img.shields.io/badge/powered_by-yt--dlp-ff0000.svg" alt="Powered by yt-dlp" />
<img src="https://img.shields.io/badge/audio_%2B_video-ffmpeg-007808.svg" alt="ffmpeg" />
<img src="https://img.shields.io/badge/no_ads-100%25-22c55e.svg" alt="No ads" />
<img src="https://img.shields.io/badge/crafted_by-Kai_Jové-ff2d90.svg" alt="Crafted by Kai Jové" />
<img src="https://img.shields.io/badge/built_with-%E2%99%A5-ff2d90.svg" alt="Built with love" />

  <br /><br />

  <strong>⚡ Fast</strong> &nbsp;•&nbsp;
  <strong>🎨 Beautiful</strong> &nbsp;•&nbsp;
  <strong>🎵 Video & Audio</strong> &nbsp;•&nbsp;
  <strong>🖥️ Desktop</strong>

</div>

---

## ✨ What is it

Universal Downloader turns downloading media from the web into a **paste-and-go** experience — no terminal, no `yt-dlp` flags to memorize. Paste a link, pick a quality, hit download.

Under the hood: **yt-dlp** + **FFmpeg** do the heavy lifting, wrapped in a **Tauri + Rust + React** desktop app with a hand-built, Tokyo-inspired interface.

## 🚀 Download & try it

> **Fastest way to test it:** download **[`Universal Downloader_1.0.0_x64-setup.exe`](Universal%20Downloader_1.0.0_x64-setup.exe)** and run it — no terminal, no dev setup, no build step.

If it reports `yt-dlp`/`ffmpeg` as missing, check [Requirements](#-requirements) below or `Settings → Developer` inside the app.

## 👀 Preview

<div align="center">
  <img src="docs/assets/12.png" alt="Universal Downloader main interface" width="850" />
  <br /><br />
  <img src="docs/assets/14.png" alt="Universal Downloader download interface" width="850" />
</div>

## 🧠 How it works

<div align="center">
  <img src="docs/assets/comfunciona.png" alt="How Universal Downloader works" width="850" />
  <br /><br />
</div>

1. 🔗 **Paste a link** — video, audio or playlist.
2. 🔎 **Auto-detect** — `yt-dlp` fetches title, thumbnail, duration, formats.
3. 🎛️ **Pick a preset** — Best, Best compatible, Smallest, Audio-only, or go custom.
4. 💬 **Subtitles** — download or embed, including auto-generated ones.
5. ⬇️ **Queue & progress** — live speed, ETA and stage (`Downloading → Merging → Finalizing`).
6. ⏯️ **Full control** — pause, resume, cancel or retry any download.
7. 🕘 **History** — every finished download is kept and searchable.

## 🌍 Supported sites

Native fast-path detection for **YouTube, Vimeo, Twitch, Dailymotion and SoundCloud** — everything else falls back to `yt-dlp`'s own extractors, which cover **1000+ sites** (Instagram, TikTok, X/Twitter, Facebook, Twitch clips, podcasts, and more).

## 🎯 Features

| | |
|---|---|
| 🔗 Paste-and-go | Drop a link, metadata resolves automatically |
| 🎞️ Media preview | Thumbnail, title, uploader, duration, formats |
| 🎚️ Quality presets | Best · Compatible · Smallest · Audio · Custom |
| 💬 Subtitles | Download or embed, including auto-generated ones |
| 📥 Real download queue | Configurable concurrency, next item auto-starts |
| 📈 Live progress | Percentage, speed, ETA, current stage |
| ⏯️ Pause / resume / cancel / retry | Full control per download, with retry backoff |
| 🕘 Searchable history | Never lose track of what you downloaded |
| 📎 Playlist file support | Open/associate `.m3u` / `.m3u8` files directly |
| 🖥️ Desktop integration | Tray, start at login, drag & drop, clipboard watch, notifications |
| 🩺 Diagnostics | Inspect detected `yt-dlp`/`ffmpeg` versions and logs |
| 🎨 Animated UI | Tokyo-inspired design, smooth motion throughout |

## 🏗️ Tech stack

| Layer | Technology |
|---|---|
| 🦀 Backend | Rust (stable) |
| 🖥️ Desktop shell | Tauri 2 |
| ⚛️ Frontend | React 18 + TypeScript 5 |
| ⚡ Build tool | Vite 5 |
| 🧠 State management | Zustand 5 |
| 🎨 Styling & motion | Tailwind CSS + Framer Motion |
| 📥 Download engine | yt-dlp + FFmpeg |
| 🧩 Icons | Lucide |
| 🧪 Testing | Vitest — 131 tests across 18 files |

<details>
<summary>🏛️ Project structure</summary>

```text
src/
├── app/            App shell, global subscriptions and overlays
├── core/engine/    Event bus, errors, persistence, URL resolvers
├── modules/
│   ├── downloads/  Queue, cards, actions, progress
│   ├── metadata/   Resolution, ranking, cache
│   ├── advanced/   yt-dlp args, templates, retry logic
│   ├── settings/   Settings store, migration, UI
│   └── desktop/    Tray, drag & drop, clipboard, notifications, updater
├── shared/         Reusable components and utilities
└── design-system/  Motion system and design tokens

src-tauri/src/      lib.rs · commands.rs · diagnostics.rs · tray.rs
```

> Business logic never lives inside UI components — it belongs in hooks, services and stores.

</details>

## 📦 Requirements

Node.js 20+ · pnpm 9+ · Rust stable · `yt-dlp` · `ffmpeg`

```bash
# Windows
winget install yt-dlp.yt-dlp Gyan.FFmpeg

# macOS
brew install yt-dlp ffmpeg

# Linux
pipx install yt-dlp && apt install ffmpeg
```

If a GUI build can't find them on `PATH`, set explicit paths in `Settings → Developer`.

## 🛠️ Development

```bash
pnpm install
pnpm tauri dev      # run in dev mode
pnpm check          # typecheck + lint + tests
pnpm tauri build    # production installer/bundle
```

## 📚 Docs

More detail lives in [`docs/`](docs/): architecture, build, settings, download/metadata engines, desktop integration, troubleshooting, FAQ.

## 🗺️ Roadmap

- Bundle `yt-dlp`/`ffmpeg` as app sidecars
- Enable the automatic updater
- First-class playlist downloading

## 🤝 Contributing & Security

See [`CONTRIBUTING.md`](CONTRIBUTING.md) (run `pnpm check` before submitting) and [`SECURITY.md`](SECURITY.md) for vulnerability reports.

## 📄 License

MIT — see [`LICENSE`](LICENSE). © 2026 Kai

---

<div align="center">

<h3>Made with ❤️ by Kai</h3>

  <img src="docs/assets/cor.png" alt="Universal Downloader about dialog" width="850" />

🌸 Inspired by Tokyo &nbsp;•&nbsp; ⚡ Built with modern tech &nbsp;•&nbsp; ❤️ Made with care

<br /><br />

<sub>Universal Downloader — Download anything. Simply.</sub>

</div>
