# Installation

How to install Universal Downloader on each platform, and the runtime tools it
needs.

## Table of contents

- [Runtime requirements](#runtime-requirements)
- [Windows](#windows)
- [macOS](#macos)
- [Linux](#linux)
- [Verifying the tools](#verifying-the-tools)

## Runtime requirements

Universal Downloader drives two external tools, which must be installed
separately:

- **yt-dlp** — performs the actual downloads and metadata probing.
- **ffmpeg** — merges video/audio and handles audio extraction.

The app searches your PATH and common install locations for both. If it can't
find them, set explicit paths in **Settings → Developer**.

## Windows

Install the app from the `-setup.exe` (NSIS) or `.msi` installer. The NSIS
installer lets you choose a per-user or per-machine install.

Install the tools with winget:

```powershell
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg
```

## macOS

Open the `.dmg` and drag the app to Applications.

> The build is **not notarised or signed**, so on first launch macOS may warn
> that the developer can't be verified. Right-click the app → **Open** to allow it.

Install the tools with Homebrew:

```bash
brew install yt-dlp ffmpeg
```

## Linux

Choose the format that fits your distro:

- **AppImage** — portable; `chmod +x` it and run.
- **.deb** — Debian / Ubuntu: `sudo apt install ./universal-downloader_*.deb`
- **.rpm** — Fedora / RHEL: `sudo dnf install ./universal-downloader-*.rpm`

Install the tools:

```bash
# Debian / Ubuntu
sudo apt install ffmpeg
pipx install yt-dlp     # or: sudo apt install yt-dlp

# Fedora
sudo dnf install ffmpeg yt-dlp
```

> The `.deb` and `.rpm` packages do **not** declare yt-dlp/ffmpeg as hard
> dependencies, because they can be installed many ways (pip, pipx, manual
> binaries) that the package manager wouldn't recognise. Install them yourself
> using any method above.

## Verifying the tools

Confirm both tools are reachable:

```bash
yt-dlp --version
ffmpeg -version
```

Or open the app's **Settings → Developer → Diagnostics**, which reports the
detected versions. If either shows "not found", install it or set its path.
