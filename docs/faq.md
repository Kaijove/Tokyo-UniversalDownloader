# FAQ

## Table of contents

- [General](#general)
- [Downloads](#downloads)
- [Tools](#tools)
- [Privacy](#privacy)

## General

**What is Universal Downloader?**
A desktop app that downloads video and audio from the web by wrapping `yt-dlp`
and `ffmpeg` behind a minimal interface.

**Which platforms are supported?**
Windows, macOS, and Linux.

**Is it signed / notarised?**
Not currently. On macOS you may need to right-click → **Open** on first launch.

**Does it bundle yt-dlp and ffmpeg?**
No — you install those separately (see [installation.md](installation.md)).
Bundling them as sidecars is on the roadmap.

## Downloads

**Where do downloads go?**
To your default folder (set in **Settings → Downloads**), or a folder you're
prompted for if "Always ask" is on.

**Can I download audio only?**
Yes — use audio mode and pick a format and bitrate in **Settings → Audio**.

**Can I download subtitles?**
Yes — enable them in **Settings → Advanced → Subtitles**, including
auto-generated captions.

**How many downloads run at once?**
Configurable via **Max concurrent** (Settings → Performance). Extra downloads
queue and start automatically.

**What happens if a download fails?**
Transient failures retry automatically with backoff. Permanent failures stop
and can be retried manually. Failed downloads are recorded in history.

**Are playlists supported?**
The options exist, but playlist download isn't a first-class flow yet — see the
roadmap in the [README](../README.md#roadmap).

## Tools

**Why does the app need yt-dlp and ffmpeg?**
yt-dlp does the downloading and metadata; ffmpeg merges streams and extracts
audio. The app orchestrates them.

**The app can't find them even though they're installed.**
See [troubleshooting.md](troubleshooting.md#a-download-fails-immediately). Set
explicit paths in **Settings → Developer** if needed.

## Privacy

**Does the app phone home?**
No. It talks to the sites you download from (via yt-dlp) and, if you enable it,
an update endpoint — which is currently not configured.

**How do I download content that needs a login?**
Provide cookies in **Settings → Advanced → Privacy**.
