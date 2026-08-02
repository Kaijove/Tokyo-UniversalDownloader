<div align="center">

  <img src="docs/assets/logo.png" alt="Universal Downloader" width="150" />

  <h1>Universal Downloader</h1>

  <p>
    <strong>Download anything. Simply.</strong>
  </p>

  <p>
    A beautiful, fast and modern desktop downloader for video and audio from the web.
  </p>

  <br />

  <p>
    <img src="https://img.shields.io/badge/Tauri-2-24C8DB.svg?logo=tauri" alt="Tauri 2" />
    <img src="https://img.shields.io/badge/React-18-61DAFB.svg?logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Rust-stable-000000.svg?logo=rust" alt="Rust" />
    <img src="https://img.shields.io/badge/tests-131%20passing-brightgreen.svg" alt="131 tests passing" />
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  </p>

  <br />

  <p>
    <strong>⚡ Fast</strong>
    &nbsp;•&nbsp;
    <strong>🎨 Beautiful</strong>
    &nbsp;•&nbsp;
    <strong>🎵 Video & Audio</strong>
    &nbsp;•&nbsp;
    <strong>🖥️ Desktop</strong>
  </p>

</div>

---

# ✨ Universal Downloader

Universal Downloader is a modern desktop application designed to make downloading media from the web **simple, fast and beautiful**.

Instead of dealing with command-line tools and complicated parameters, Universal Downloader provides a clean graphical interface where you can:

- Paste a link
- Automatically detect the media
- Preview the content
- Choose quality and format
- Download video or audio
- Monitor progress in real time
- Pause, resume, cancel or retry downloads
- Keep track of previous downloads
- Configure advanced options
- Use desktop integrations such as clipboard monitoring and drag & drop

Behind the interface, the application uses the power of **yt-dlp** and **FFmpeg**, while the desktop experience is powered by **Tauri, Rust, React and TypeScript**.

---

## 🚀 Try it instantly

You don't need to build the project yourself just to try Universal Downloader.

### 🪟 Windows

If you simply want to test the application:

**Run the `.exe` included with the project/release.**

That's it.

No terminal.
No development environment.
No need to understand the source code.

Open the executable and Universal Downloader will launch as a desktop application.

> **Tip:** If the application reports that `yt-dlp` or `ffmpeg` is missing, check the [Requirements](#-requirements) section or the application Settings → Developer section.

---

# 👀 Preview

<div align="center">

  <img src="docs/assets/12.png" alt="Universal Downloader main interface" width="850" />

  <br />
  <br />

  <img src="docs/assets/14.png" alt="Universal Downloader download interface" width="850" />

</div>

<br />

The interface is designed around one simple idea:

> **Paste a link and let Universal Downloader handle the rest.**

The main screen keeps the most important action — downloading media — at the center while providing useful information around it without making the interface feel complicated.

---

# 🧠 How it works

<div align="center">

  <img src="docs/assets/comfunciona.png" alt="How Universal Downloader works" width="850" />

</div>

Universal Downloader follows a simple workflow from the moment you paste a URL until the file is ready.

### 1. 🔗 Paste a link

Paste a supported video, audio or playlist URL into the main input.

The application is designed around a **paste-and-go workflow**, so you don't have to manually configure everything before knowing what is available.

---

### 2. 🔎 Media detection

Universal Downloader uses `yt-dlp` to inspect the URL and retrieve the available media information.

Depending on the source, the application can detect information such as:

- Title
- Uploader
- Duration
- Thumbnail
- Available formats
- Available resolutions
- Available audio formats
- Other media metadata

This information is then presented inside the application so you can make an informed choice before downloading.

---

### 3. 🎛️ Choose how you want to download

You can either let Universal Downloader make the decision for you or configure the download manually.

Quality presets include:

- **Best** — prioritize the highest available quality.
- **Best compatible** — choose a high-quality format while maintaining broader compatibility.
- **Smallest** — prioritize a smaller file size.
- **Audio** — extract audio instead of downloading video.
- **Custom options** — configure more advanced download behaviour.

---

### 4. 🎬 Choose video or audio

Universal Downloader supports both video and audio workflows.

For video downloads, you can select the desired quality and format.

For audio downloads, the application can extract audio and let you choose the preferred format and bitrate.

---

### 5. 💬 Subtitles

Subtitles can also be downloaded or embedded when available.

The application supports subtitle handling including:

- Downloading subtitles
- Embedding subtitles
- Auto-generated subtitles
- Selecting subtitle languages

---

### 6. ⬇️ Add the download to the queue

When you start a download, it is added to the application's download queue.

The queue coordinator controls how many downloads can run simultaneously.

If the maximum concurrency has been reached, additional downloads wait automatically until another slot becomes available.

---

### 7. 📊 Monitor the download

While downloading, Universal Downloader provides live information such as:

- Progress
- Download speed
- Estimated remaining time
- Current download state
- Current processing phase

The download pipeline can move through stages such as:

`Downloading → Merging → Finalizing`

This allows you to see what the application is doing instead of staring at an unexplained progress bar.

---

### 8. ⏯️ Control the download

Each active download can be controlled individually.

Available actions include:

- Pause
- Resume
- Cancel
- Retry

Transient failures can also be handled through automatic retry logic with backoff.

---

### 9. ✅ Finish and keep it in history

Once the download is completed, it becomes part of the application's history.

The history system allows finished downloads to be recorded and searched later without having to remember what was downloaded manually.

---

### 10. 🖥️ Desktop integration

Universal Downloader isn't limited to its main window.

The application also integrates with the desktop through features such as:

- System tray
- Start at login
- Minimize to tray
- Drag & drop links
- Optional clipboard monitoring
- Native desktop notifications

The clipboard watcher can detect copied links when enabled, making the workflow even faster.

---

# ✨ Features

## 🔗 Paste-and-go

The URL input is the heart of the application.

Paste a link and Universal Downloader automatically starts resolving its metadata so you can review the content before downloading.

---

## 🎞️ Media preview

Before downloading, the application can display useful media information such as:

- Thumbnail
- Title
- Uploader
- Duration
- Available formats
- Available quality levels

This makes it easier to know exactly what you're about to download.

---

## 🎚️ Format & quality selection

Choose exactly how you want your media downloaded.

Use automatic presets when you don't want to think about technical details, or configure the available options yourself.

---

## 🎵 Audio extraction

Download audio-only content when you don't need the video.

Choose the preferred audio format and bitrate according to the available options.

---

## 💬 Subtitles

Download or embed subtitles, including auto-generated subtitles, and select the languages you want when supported by the source.

---

## 📥 Download queue

Universal Downloader includes a real download queue.

Downloads are coordinated automatically according to the configured concurrency limit.

When a slot becomes available, the next waiting download starts automatically.

---

## 📈 Live progress

Each download provides live feedback including:

- Percentage
- Speed
- ETA
- Current processing stage

So you always know what is happening.

---

## ⏯️ Pause, resume, cancel & retry

You have direct control over individual downloads.

Pause a download, continue it later, cancel it completely or retry it if something goes wrong.

---

## 🕘 History

Completed downloads are stored in the application's history.

The history can be searched, making it easy to find previously downloaded content.

---

## 🖥️ Desktop features

Universal Downloader integrates with the operating system through:

- System tray
- Start at login
- Minimize to tray
- Drag & drop
- Clipboard monitoring
- Native notifications
- Window state persistence

---

## 🔔 Native notifications

Optional desktop notifications can inform you when a download finishes or fails.

---

## 🩺 Diagnostics

The application includes a diagnostics section where you can inspect:

- Detected `yt-dlp` version
- Detected `ffmpeg` version
- Diagnostic information
- Logs

This makes troubleshooting significantly easier.

---

## 🎨 Animated interface

The interface uses a consistent animation and motion system to make the application feel responsive without sacrificing usability.

The design is built around a modern Tokyo-inspired visual identity with a strong focus on:

- Clarity
- Motion
- Visual hierarchy
- Smooth transitions
- Minimal interaction friction

---

# 🏗️ Technologies

| Layer | Technology |
|---|---|
| 🦀 Backend | Rust |
| 🖥️ Desktop framework | Tauri 2 |
| ⚛️ Frontend | React 18 |
| 📘 Language | TypeScript 5 |
| ⚡ Build tool | Vite 5 |
| 🧠 State management | Zustand |
| 🎨 Styling | Tailwind CSS |
| ✨ Animation | Framer Motion |
| 📥 Media engine | yt-dlp |
| 🎬 Media processing | FFmpeg |
| 🧪 Testing | Vitest |

---

## 🧪 Vitest

---

# 🏛️ Architecture

The project separates the user interface from the core application logic.

```text
src/
├── app/
│   └── App shell, global subscriptions and overlays
│
├── core/
│   └── engine/
│       ├── Event bus
│       ├── Errors
│       ├── Persistence
│       ├── History store
│       ├── Platform helpers
│       └── URL resolvers
│
├── modules/
│   ├── downloads/
│   │   ├── Download queue
│   │   ├── Download cards
│   │   ├── Actions
│   │   └── Progress
│   │
│   ├── metadata/
│   │   ├── Metadata resolution
│   │   ├── Ranking
│   │   └── Cache
│   │
│   ├── advanced/
│   │   ├── yt-dlp arguments
│   │   ├── Templates
│   │   ├── Retry logic
│   │   └── Options
│   │
│   ├── settings/
│   │   ├── Settings store
│   │   ├── Migration
│   │   └── Settings UI
│   │
│   └── desktop/
│       ├── Tray
│       ├── Drag & drop
│       ├── Clipboard
│       ├── Notifications
│       ├── Diagnostics
│       ├── Crash recovery
│       └── Updater
│
├── shared/
│   └── Reusable components and utilities
│
├── design-system/
│   └── Motion system and design tokens
│
└── styles/
    └── Global CSS

src-tauri/
└── src/
    ├── lib.rs
    ├── commands.rs
    ├── diagnostics.rs
    └── tray.rs
```

### Design principle

> **Business logic never lives inside UI components.**

The application logic belongs inside hooks, services and stores, keeping the interface easier to maintain and extend.

---

# 📦 Requirements

For development, you need:

* Node.js 20+
* pnpm 9+
* Rust stable
* Tauri prerequisites for your operating system
* yt-dlp
* FFmpeg

### Windows

```powershell
winget install yt-dlp.yt-dlp Gyan.FFmpeg
```

### macOS

```bash
brew install yt-dlp ffmpeg
```

### Linux

Use your distribution's package manager, or for example:

```bash
pipx install yt-dlp
apt install ffmpeg
```

The application also searches common installation locations, so `yt-dlp` and `ffmpeg` can often be detected even when a GUI application does not inherit the same `PATH` as your terminal.

If necessary, explicit paths can be configured through:

**Settings → Developer**

---

# 🚀 Installation

## Windows — easiest way

If a pre-built `.exe` is available, simply launch it.

No source code setup is required to try the application.

---

# 🛠️ Development installation

Clone the repository and install the dependencies:

```bash
pnpm install
```

Then start the application in development mode:

```bash
pnpm tauri dev
```

---

# 🧪 Development commands

### Type checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

### Tests

```bash
pnpm test:run
```

### Complete verification

```bash
pnpm check
```

### Project diagnostics

```bash
pnpm doctor
```

---

# 🏭 Build

To create a production build:

```bash
pnpm tauri build
```

This generates the appropriate installer/bundle for the current operating system.

---

# ⚙️ Configuration

Universal Downloader includes a dedicated Settings interface.

Settings are organized into:

### General

Everyday application behaviour and preferences.

### Advanced

More detailed download behaviour and options.

### Developer

Technical configuration, diagnostics and explicit paths for external tools such as `yt-dlp` and `ffmpeg`.

---

# 📚 Documentation

More detailed documentation is available inside the `docs/` directory.

| Document                 | Description                                |
| ------------------------ | ------------------------------------------ |
| `installation.md`        | Installation instructions                  |
| `development.md`         | Development workflow                       |
| `build.md`               | Building and packaging                     |
| `architecture.md`        | Project architecture                       |
| `settings.md`            | Settings and download options              |
| `download-engine.md`     | Queue, progress, retries and phases        |
| `metadata-engine.md`     | Metadata detection, ranking and caching    |
| `desktop-integration.md` | Tray, clipboard, notifications and updater |
| `troubleshooting.md`     | Common problems and solutions              |
| `faq.md`                 | Frequently asked questions                 |

---

# 🩹 Troubleshooting

If a download fails immediately, the first thing to check is whether `yt-dlp` and `ffmpeg` are correctly installed and detected.

You can inspect the detected versions and technical information from:

**Settings → Developer → Diagnostics**

For more detailed troubleshooting, see:

`docs/troubleshooting.md`

---

# 🗺️ Roadmap

These are planned directions supported by the current project structure.

> These are **not presented as implemented features**.

* Bundle `yt-dlp` and `ffmpeg` as application sidecars
* Enable the automatic updater
* Add first-class playlist downloading

---

# 🤝 Contributing

Contributions are welcome.

If you want to contribute, please read:

`CONTRIBUTING.md`

Before submitting changes, make sure the project passes its checks:

```bash
pnpm check
```

---

# 🔐 Security

If you discover a security vulnerability, please follow the instructions in:

`SECURITY.md`

---

# 📄 License

This project is licensed under the MIT License.

See `LICENSE` for the full license text.

© 2026 Kai

---

# ❤️ About

<div align="center">

<img src="docs/assets/cor.png" alt="Made with love" width="260" />

<br />
<br />

<h2>Made with ❤️ and a lot of love for detail.</h2>

<p>
Universal Downloader started as a project to make downloading media
<br />
feel less complicated, more intuitive and much more enjoyable.
</p>

<p>
Every part of the application — from the interface and animations
<br />
to the download engine and desktop integrations — was built
<br />
with the goal of creating something that feels genuinely nice to use.
</p>

<br />

<strong>Built by Kai.</strong>

<br />
<br />

<p>
🌸 Designed with inspiration from Tokyo
<br />
⚡ Built with modern technologies
<br />
❤️ Made with a lot of care
</p>

</div>

---

<div align="center">

<strong>Universal Downloader</strong>

<br />

Download anything. Simply.

<br />
<br />

<sub>Made with ❤️ by Kai · 2026</sub>

</div>
