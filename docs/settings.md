# Settings & Download Options

Every setting in the app and every option that maps to a `yt-dlp` flag,
documented. Nothing here is a placeholder — each setting has a real effect.

## Table of contents

- [Where settings live](#where-settings-live)
- [General](#general)
  - [Downloads](#downloads)
  - [Video](#video)
  - [Audio](#audio)
  - [Appearance](#appearance)
  - [Notifications](#notifications)
- [Advanced](#advanced)
  - [Subtitles](#subtitles)
  - [Network](#network-proxy-timeout-retry-bandwidth)
  - [Privacy (cookies)](#privacy-cookies)
  - [Performance](#performance)
  - [History](#history)
  - [Desktop](#desktop)
- [Developer](#developer)
- [Import / export & persistence](#import--export--persistence)

## Where settings live

Settings open as an overlay from the header, grouped into **General**,
**Advanced**, and **Developer**. They are stored on disk (under the `settings`
key of the app's store file) and applied immediately on change. A versioned
migration means an older or corrupt settings file can never break the app: it
drops unknown keys, fills missing ones from defaults, and never throws.

---

## General

### Downloads

| Setting | Effect |
| ------- | ------ |
| **Default folder** | Where downloads are saved. Created automatically if missing. |
| **Always ask** | Prompt for a folder on every download instead of using the default. |
| **Skip existing** | Skip files already downloaded (adds `--download-archive`). |
| **Overwrite** | Overwrite existing files instead of skipping. |
| **Filename template** | The output name pattern (see [templates](#filename-templates)). |

#### Filename templates

The template is a `yt-dlp` output template. The default is
`%(title)s [%(id)s].%(ext)s`. Common fields:

| Field | Meaning |
| ----- | ------- |
| `%(title)s` | Video title |
| `%(id)s` | Unique video ID |
| `%(ext)s` | File extension (chosen by the format) |
| `%(uploader)s` | Channel / uploader name |
| `%(upload_date)s` | Upload date (YYYYMMDD) |
| `%(playlist_index)s` | Position within a playlist |

The template is validated before use: it must be a relative path, cannot
contain `..`, and cannot contain characters illegal on your OS.

### Video

| Setting | Effect |
| ------- | ------ |
| **Quality** | Preset selector — see the table below. |
| **Container** | Preferred output container (e.g. `mp4`, `mkv`), applied via `--merge-output-format`. |
| **Max resolution** | Cap the height (e.g. 1080). |
| **Preferred codec** | Bias format selection toward a codec (e.g. `avc1`). |
| **Prefer HDR** | Prefer HDR variants when available. |
| **Prefer high FPS** | Prefer 50/60 fps variants. |

**Quality presets:**

| Preset | Meaning |
| ------ | ------- |
| `best` | Highest-quality video + audio (`bestvideo*+bestaudio/best`). |
| `best-compatible` | Widely-playable H.264 + AAC in mp4 (`bestvideo[vcodec^=avc1]+bestaudio[acodec^=mp4a]/best[ext=mp4]/best`). |
| `smallest` | Smallest file (`worstvideo*+worstaudio/worst`). |
| `custom` | Use the exact format you pick from the item's dropdown. |

> A format explicitly chosen from an item's dropdown always takes precedence
> over the quality preset.

### Audio

Audio-only mode extracts audio with `-x`.

| Setting | Effect |
| ------- | ------ |
| **Format** | Output audio format (`--audio-format`, e.g. `mp3`, `m4a`, `opus`). |
| **Bitrate** | Target audio quality in kbps (`--audio-quality`). |
| **Embed metadata** | Write tags into the file (`--embed-metadata`). |
| **Embed thumbnail** | Embed the thumbnail as cover art (`--embed-thumbnail`). |

### Appearance

| Setting | Effect |
| ------- | ------ |
| **Theme** | Light / dark / system. |
| **Density** | Compact or comfortable spacing. |
| **Reduce motion** | Minimise animations (also respects the OS setting). |

### Notifications

| Setting | Effect |
| ------- | ------ |
| **On complete** | Native desktop notification when a download finishes. |
| **On failure** | Native desktop notification when a download fails. |

In-app toasts always appear; these toggles control the **native** OS
notifications, which require the OS permission (requested once).

---

## Advanced

### Subtitles

| Setting | Effect |
| ------- | ------ |
| **Enabled** | Download subtitles (`--write-subs`). |
| **Embed** | Embed subtitles into the file (`--embed-subs`). |
| **Languages** | Language codes to fetch (`--sub-langs`). |
| **Include auto-generated** | Also fetch auto-captions (`--write-auto-subs`). |

### Network (proxy, timeout, retry, bandwidth)

| Setting | Effect |
| ------- | ------ |
| **Proxy** | Route traffic through a proxy URL (`--proxy`). |
| **Rate limit** | Cap bandwidth (`--limit-rate`). |
| **Timeout** | Socket timeout in seconds (`--socket-timeout`). |
| **Retry attempts** | How many times to retry a failed download before giving up. |
| **Retry delay** | Base backoff delay between retries (grows per attempt). |

Retries only fire for transient errors; permanent errors fail immediately.

### Privacy (cookies)

Cookies let you download content that requires being logged in.

| Setting | Effect |
| ------- | ------ |
| **Cookie browser** | Import cookies straight from a browser (`--cookies-from-browser`). |
| **Cookie file** | Use a Netscape-format cookies file (`--cookies`). |

### Performance

| Setting | Effect |
| ------- | ------ |
| **Max concurrent** | How many downloads run at once; the rest queue. |
| **Metadata cache TTL** | How long probe results are cached (minutes). |

### History

| Setting | Effect |
| ------- | ------ |
| **Enabled** | Record finished downloads. |
| **Max entries** | Cap the number of stored entries; older ones are trimmed. |

### Desktop

| Setting | Effect |
| ------- | ------ |
| **Launch at startup** | Start the app when you log in. |
| **Start minimized** | Start hidden / minimised. |
| **Minimize to tray** | Closing the window hides it to the tray instead of quitting. |
| **Remember window state** | Restore window size/position on next launch. |
| **Clipboard monitor** | Watch the clipboard and suggest detected links (opt-in). |

---

## Developer

| Setting | Effect |
| ------- | ------ |
| **yt-dlp path** | Explicit path to the yt-dlp binary (overrides auto-detection). |
| **ffmpeg path** | Explicit path to the ffmpeg binary. |
| **Verbose logs** | Pass `--verbose` to yt-dlp for detailed output. |
| **Debug mode** | Enable extra in-app logging. |

This group also contains the **Diagnostics** panel and **log viewer**.

---

## Import / export & persistence

Settings can be exported to and imported from JSON (via the clipboard) from the
settings footer. Import is validated through the same migration that runs on
load, so a malformed import can never corrupt your configuration — invalid or
unknown fields are dropped and missing ones are filled from defaults.
