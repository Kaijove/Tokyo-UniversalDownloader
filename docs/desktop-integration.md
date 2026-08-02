# Desktop Integration

The OS-level features: tray, window behaviour, drag & drop, clipboard,
notifications, diagnostics, and the updater.

## Table of contents

- [System tray](#system-tray)
- [Window behaviour](#window-behaviour)
- [Drag & drop](#drag--drop)
- [Clipboard monitor](#clipboard-monitor)
- [Notifications](#notifications)
- [Diagnostics & logs](#diagnostics--logs)
- [Updater](#updater)

## System tray

The app installs a system-tray icon with a menu to show/hide the window and
quit. Clicking the tray icon restores the window (showing, un-minimising, and
focusing it, so it can never be "lost"). The tray tooltip reflects the current
queue state (e.g. how many downloads are active). Tray setup is non-fatal: if
it fails on a platform without tray support, the app still starts.

## Window behaviour

Three preferences (in **Settings → Desktop**) control the window:

- **Start minimized** — the window starts minimised.
- **Minimize to tray** — closing the window hides it to the tray instead of
  quitting; restore it from the tray.
- **Remember window state** — size and position are saved on close and restored
  next launch.

## Drag & drop

Drop link-list files onto the window — `.txt`, `.m3u`, `.m3u8`, `.url`, and
`.desktop` files are read and scanned for URLs, which then go through the exact
same sanitise → probe → queue path as a pasted link. (The OS drag-and-drop
event delivers file paths, not selected text.)

## Clipboard monitor

Opt-in (**Settings → Desktop → Clipboard monitor**). When enabled, the app
watches the clipboard and, if it detects a link, offers a one-click suggestion
to add it. Dismissed links aren't suggested again.

## Notifications

Optional native desktop notifications on completion and/or failure (toggled in
**Settings → Notifications**). In-app toasts always appear regardless; the
toggles control the **OS** notifications, which need permission — requested
once, and handled gracefully if denied (the toast still shows).

## Diagnostics & logs

**Settings → Developer → Diagnostics** reports the detected yt-dlp and ffmpeg
versions (and the OS/arch), so you can confirm the tools are found. A log viewer
shows recent output, exportable to the clipboard for bug reports.

## Updater

> **Status: prepared but not active.** The updater plumbing is wired (the plugin
> is registered and the app can check for updates), but it is **not configured**
> to actually update — `endpoints` and `pubkey` are empty and
> `createUpdaterArtifacts` is `false`. The app reports this state honestly as
> "not configured" rather than failing.

To enable it:

1. Generate signing keys: `pnpm tauri signer generate -w ~/.tauri/app.key`
2. Put the public key in `tauri.conf.json` under `plugins.updater.pubkey`.
3. Add an update endpoint (e.g. a GitHub Releases `latest.json`) to
   `plugins.updater.endpoints`.
4. Set `bundle.createUpdaterArtifacts` to `true`.
5. Provide `TAURI_SIGNING_PRIVATE_KEY` and its password to the release build
   (the release workflow already references these secrets).

Until then, the "check for updates" action reports that updates aren't
configured.
