Sí. Ara que ja tens el projecte acabat, jo faria el README molt més visual i tipus projecte de GitHub premium, però sense inventar funcionalitats que no tens.

També faria que Logo.png sigui el protagonista de l'entrada, i que 12.PNG i 14.PNG apareguin com a previews grans de la UI.

Et deixo el README sencer per substituir l'actual, ja preparat per copiar i enganxar directament:

<div align="center">

  <img src="Logo.png" alt="Universal Downloader Logo" width="180" />

  # Universal Downloader

  ### Download anything. Simply.

  **A beautiful, fast and powerful desktop downloader for video, audio and playlists.**

  <p>
    Paste a link. Choose your options. Download.
  </p>

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

## ✨ Try Universal Downloader

> **Want to try it without setting up the development environment?**

### 🖥️ Windows

If you are on Windows, you can simply use the **`.exe` included with the project** to launch Universal Downloader.

**Download / open the `.exe` and start using the application.**

For development, advanced configuration and dependency setup, continue reading this README.

---

## 🌸 Preview

Universal Downloader is designed around a simple idea:

> **Downloading media should be ridiculously easy.**

No complicated command-line commands.  
No confusing interfaces.  
No unnecessary steps.

Just paste a link and let Universal Downloader handle the rest.

<div align="center">

  <img src="12.PNG" alt="Universal Downloader main interface" width="900" />

  <br><br>

  <img src="14.PNG" alt="Universal Downloader download interface" width="900" />

</div>

---

## 🎌 What is Universal Downloader?

**Universal Downloader** is a modern desktop application for downloading video and audio from the web.

The application provides a clean graphical interface around powerful media tools such as [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) and [`ffmpeg`](https://ffmpeg.org/).

Instead of opening a terminal and remembering complicated commands, everything is handled through a visual interface:

```text
Paste URL
   ↓
Detect media
   ↓
Review metadata
   ↓
Choose format / quality
   ↓
Download
   ↓
Track progress
   ↓
Done

The application is built with Tauri 2, combining a lightweight Rust backend with a modern React frontend.

🚀 Features
🔗 Paste-and-go downloading

The main interface is built around one simple action:

paste a URL and download it.

When a supported URL is entered, Universal Downloader can resolve information such as:

Video title
Uploader
Duration
Thumbnail
Available formats
Available qualities
Audio options

The goal is to make the entire process feel immediate and intuitive.

🎞️ Format & quality selection

Choose exactly how you want your media downloaded.

Available controls include quality presets and format selection, allowing you to choose between:

Best quality
Best compatible quality
Smaller downloads
Video formats
Audio formats
Custom download options

You can either manually configure the download or let Universal Downloader choose sensible defaults automatically.

🎵 Audio extraction

Need only the audio?

Universal Downloader can extract audio from supported media and let you choose your preferred audio format and bitrate.

Useful for:

Music
Podcasts
Interviews
Soundtracks
Audio-only content
💬 Subtitles

Subtitle support allows you to download or embed subtitles when available.

You can work with:

Regular subtitles
Automatically generated subtitles
Multiple subtitle languages
Downloaded subtitle files
Embedded subtitles
📥 Real download queue

Downloads are handled through a proper queue system instead of launching everything simultaneously.

The queue:

Controls concurrent downloads
Automatically starts waiting downloads
Tracks active downloads
Tracks completed downloads
Handles failed downloads
Keeps the interface responsive

This makes it possible to queue multiple downloads without manually managing every process.

📊 Live download progress

Every active download provides useful real-time information.

You can see things such as:

Download percentage
Current speed
Estimated time remaining
Current processing phase
Download status
Progress bar

The application also understands different phases of the download pipeline:

Downloading
     ↓
Merging
     ↓
Finalizing
     ↓
Completed
⏯️ Pause, resume, cancel & retry

Downloads are designed to be controllable.

Depending on the current state, you can:

Pause downloads
Resume downloads
Cancel downloads
Retry failed downloads

Transient failures can also be handled through automatic retry logic with backoff.

🕘 Download history

Previous downloads are kept in a dedicated history interface.

The history allows you to:

Review previous downloads
Search through downloaded items
See download status
Inspect media information
Access completed files

The interface keeps the history available without letting it overwhelm the main downloader.

🖥️ Desktop integration

Universal Downloader isn't just a webpage wrapped in a window.

The application integrates with the desktop through Tauri and provides features such as:

System tray integration
Start at login
Minimize to tray
Drag & drop
Clipboard monitoring
Native notifications
Desktop window state
File opening
Application updater infrastructure
📋 Clipboard monitoring

Universal Downloader can optionally monitor the clipboard for supported links.

When enabled, copying a media URL can allow the application to detect it automatically.

The feature is optional and can be controlled through Settings.

🔔 Native notifications

The application can use native desktop notifications for important events such as:

Download completed
Download failed
Other relevant download states
🩺 Diagnostics

A built-in diagnostics interface helps inspect the media downloading environment.

It can report detected versions of:

yt-dlp
ffmpeg

It also provides access to relevant logs and diagnostic information when troubleshooting problems.

🎨 Interface

Universal Downloader is designed around a dark Tokyo / Sakura-inspired visual identity.

The interface combines:

Deep dark backgrounds
Neon pink accents
Blue/purple lighting
Glassmorphism
Sakura petals
Soft blur effects
Animated UI elements
Compact desktop cards
Clear visual hierarchy

The visual design is intentionally built to feel more like a polished desktop application than a traditional downloader.

The interface is also designed around a clear hierarchy:

                 MAIN DOWNLOADER
                       ↓
              Paste → Configure → Download

      OPTIONS                         INFORMATION
         ↓                                  ↓
   Quality / Format                  Weather / Stats
   Audio / Advanced                  Clipboard / Status

                    ↓

              DOWNLOAD HISTORY

The main downloader remains the visual focus while secondary information stays accessible without taking over the interface.

🧠 How it works

Universal Downloader separates the application into several layers.

1. Frontend

The React interface handles:

User interaction
Download cards
Settings
History
Metadata presentation
Progress visualization
Animations
2. Application state

Zustand manages shared application state such as:

Downloads
Settings
Metadata
History
UI state
3. Rust / Tauri backend

The Rust backend handles communication with the desktop environment and the media tools.

It exposes commands for operations such as:

probe_media
download_media
stop_download
open_path
4. yt-dlp

yt-dlp performs the actual media extraction and downloading.

5. ffmpeg

ffmpeg handles media processing tasks such as merging and conversion when required.

🏗️ Architecture
Universal Downloader
│
├── React + TypeScript
│   ├── App
│   ├── Downloads
│   ├── Metadata
│   ├── Settings
│   ├── History
│   ├── Desktop UI
│   └── Design System
│
├── Zustand
│   └── Application State
│
├── Tauri 2
│   └── Rust Backend
│       ├── Commands
│       ├── Diagnostics
│       └── System Tray
│
└── Media Engine
    ├── yt-dlp
    └── ffmpeg
🛠️ Tech Stack
Layer	Technology
Desktop framework	Tauri 2
Frontend	React 18
Language	TypeScript 5
Backend	Rust
Build tool	Vite 5
State management	Zustand
Styling	Tailwind CSS
Animation	Framer Motion
Media downloading	yt-dlp
Media processing	ffmpeg
Testing	Vitest
📁 Project Structure
src/
├── app/
│   └── Application shell and global overlays
│
├── core/
│   └── Engine, events, persistence and platform logic
│
├── modules/
│   ├── downloads/
│   │   └── Queue, cards, progress and actions
│   │
│   ├── metadata/
│   │   └── Metadata resolution and caching
│   │
│   ├── advanced/
│   │   └── yt-dlp arguments and download options
│   │
│   ├── settings/
│   │   └── Settings store and UI
│   │
│   └── desktop/
│       └── Tray, clipboard, notifications and diagnostics
│
├── shared/
│   └── Reusable components and utilities
│
├── design-system/
│   └── Motion system and design tokens
│
└── styles/
    └── Global styles

src-tauri/
└── src/
    ├── lib.rs
    ├── commands.rs
    ├── diagnostics.rs
    └── tray.rs
Architecture principle

Business logic never lives inside UI components.

Business logic belongs inside hooks, services and stores, keeping the interface components focused on presentation and interaction.

⚙️ Requirements

For development, you will need:

Node.js 20+
pnpm 9+
Rust stable
Tauri prerequisites
yt-dlp
ffmpeg

The backend expects yt-dlp and ffmpeg to be available to the application.

Windows
winget install yt-dlp.yt-dlp Gyan.FFmpeg
macOS
brew install yt-dlp ffmpeg
Linux

Install them using your distribution's package manager, or use:

pipx install yt-dlp
apt install ffmpeg

Universal Downloader also searches common installation locations and allows explicit paths to be configured through:

Settings → Developer

🧑‍💻 Development

Clone the project and install dependencies:

pnpm install

Start the application in development mode:

pnpm tauri dev
🧪 Scripts
Type checking
pnpm typecheck
Linting
pnpm lint
Tests
pnpm test:run
Full validation
pnpm check
Development / production diagnostics
pnpm doctor
📦 Build

Build the desktop application with:

pnpm tauri build

Tauri will produce the appropriate installer/bundle for the target platform.

Supported platforms include:

Windows
macOS
Linux
⚙️ Configuration

Universal Downloader includes a dedicated Settings interface.

Settings are organized into:

General

Everyday application preferences.

Advanced

Download and media-processing options.

Developer

Technical configuration including paths and diagnostic information.

The complete configuration reference is available in:

docs/settings.md

📚 Documentation

More detailed documentation is available throughout the project:

Document	Description
Installation	Platform-specific installation
Development	Local development workflow
Build	Building the application
Architecture	Internal application architecture
Settings	Configuration and download options
Download Engine	Queue, progress, retry and download phases
Metadata Engine	Metadata detection and caching
Desktop Integration	Tray, clipboard, notifications and updater
Troubleshooting	Common problems and solutions
FAQ	Frequently asked questions
🐛 Troubleshooting

If a download fails immediately, the first thing to check is whether:

yt-dlp is installed
ffmpeg is installed
Both tools are accessible to the application
The configured paths are correct

You can inspect the detected versions and diagnostics from the application's Developer settings.

More troubleshooting information is available in:

docs/troubleshooting.md

🗺️ Roadmap

The project architecture is prepared for future improvements.

Potential future work includes:

 Bundling yt-dlp and ffmpeg as application sidecars
 Fully enabling the automatic updater
 First-class playlist downloading
 Additional platform-specific improvements
 Further UI and animation refinements

These items represent planned directions and are not currently implemented unless explicitly stated elsewhere in the project.

🤝 Contributing

Contributions are welcome.

Before contributing, please review:

CONTRIBUTING.md

🔐 Security

If you discover a security vulnerability, please follow the instructions in:

SECURITY.md

📄 License

This project is licensed under the MIT License.

Copyright © 2026 Kai

❤️ Credits

Universal Downloader is built on top of several excellent open-source projects:

Tauri — Desktop application framework
yt-dlp — Media downloading engine
FFmpeg — Media processing
React — Frontend UI
TypeScript — Type-safe development
Tailwind CSS — Styling
Framer Motion — UI animation
Lucide — Interface icons
<div align="center"> <img src="Logo.png" alt="Universal Downloader" width="96" />
Universal Downloader

Download anything. Simply.

Made with ❤️ and a lot of Sakura 🌸

</div> ```
