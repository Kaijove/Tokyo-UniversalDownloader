# Desktop Integration

Native desktop behaviour layered on the existing architecture. Nothing here
reimplements queue, settings or persistence logic — it reuses them.

## What was reused

| Feature | Reuses |
|---|---|
| Drag & drop | `sanitizeUrl` (engine), `useAddDownload` |
| Clipboard monitor | `extractUrls` → `useAddDownload`, settings store |
| Tray queue actions | `useDownloadActions`, downloads store |
| Crash recovery | existing persistence layer (queue is already restored) |
| Diagnostics | downloads store, history store, log store |
| Binary validation | mirrors the Rust `validate_output_dir` pattern |

## Implemented

- **System tray** (Rust) — show/hide, pause/resume/cancel all, open folder,
  history, settings, quit. Queue actions are forwarded to the frontend as
  `tray://action` events rather than reimplemented in Rust, so the queue stays
  a single source of truth. The tooltip reflects real queue activity.
- **Window state** — via `tauri-plugin-window-state`; size, position and
  maximised state restore automatically.
- **Autostart** — via `tauri-plugin-autostart`, with launch-at-startup,
  start-minimized and minimize-to-tray settings.
- **Drag & drop** — text drops and `.txt`, `.m3u`, `.m3u8`, `.url`, `.desktop`
  files are scanned for links, which go through the normal add flow.
- **Clipboard monitor** — opt-in, polls only while enabled, stores nothing,
  transmits nothing. Offers a one-click download for copied links.
- **Structured logging** — levels, sources, search, filters, clipboard export,
  clear, and a debug-mode toggle that gates `debug` records.
- **Diagnostics** — app version, OS, architecture, and *real* yt-dlp/FFmpeg
  versions obtained by running the binaries. A missing tool is reported as
  missing, never faked. Queue, history and log counts come from the stores.
- **Crash recovery** — a session marker records a clean exit; if it's absent on
  startup, the user is told the previous run ended unexpectedly and how many
  downloads were restored.
- **Security** — `validateBinaryPath` rejects relative paths, `..` and shell
  metacharacters before a custom binary path reaches the process spawner.
- **File associations** — `.m3u` / `.m3u8` only. These are real formats;
  invented extensions were not registered.

## Updater: prepared, not pretended

The updater plugin, service, settings and UI are wired end to end, but
`tauri.conf.json` has an empty `endpoints` array and no `pubkey`, because this
build isn't published anywhere. The UI reports **"Updater is not configured"**
instead of a fake "up to date".

To activate it later:
1. `pnpm tauri signer generate` and keep the private key secret.
2. Publish releases with a `latest.json` manifest signed by that key.
3. Put the manifest URL in `plugins.updater.endpoints` and the public key in
   `plugins.updater.pubkey`.

## Left for future versions

- **List virtualization** — cards are memoised; unnecessary at personal scale.
- **CPU/memory process metrics** — would need a system-info crate in Rust.
  Diagnostics reports real application state instead of estimated numbers.
- **Beta update channel** — meaningless until a stable channel exists.

## Rust status

The Rust in this module (`tray.rs`, `diagnostics.rs`, plugin registration) is
written but **not yet compiled** — validation is the next module's job. Expect
minor API adjustments, particularly around the tray menu builder and plugin
initialisers.

## Tests

`url-extractor.test.ts` (10), `binary-validator.test.ts` (5),
`log-filter.test.ts` (8). Run with `pnpm test`.
