# Troubleshooting

Fixes for the most common problems, most likely first.

## Table of contents

- [A download fails immediately](#a-download-fails-immediately)
- [Metadata never loads](#metadata-never-loads)
- [Merging fails / no audio](#merging-fails--no-audio)
- [The app won't start](#the-app-wont-start)
- [Nothing happens after pasting](#nothing-happens-after-pasting)
- [Login-required content fails](#login-required-content-fails)

## A download fails immediately

**Almost always: yt-dlp or ffmpeg can't be found.** GUI apps inherit a minimal
PATH, so a tool that works in your terminal may not be visible to the app.

1. Open **Settings → Developer → Diagnostics**. If yt-dlp or ffmpeg shows "not
   found", that's the cause.
2. Either install the tool (see [installation.md](installation.md)) or set its
   full path in **Settings → Developer**.

The app also searches common install locations automatically, so this usually
resolves itself — but an explicit path always wins.

## Metadata never loads

If a card sits on "Analyzing" and then errors, the probe couldn't reach the
host or yt-dlp failed. The probe times out after 30 seconds and becomes a
retryable error. Check the URL is valid and reachable, and that yt-dlp is found
(see above). Expand the card's **Technical details** for the real message.

## Merging fails / no audio

Merging separate video and audio streams needs **ffmpeg**. If downloads finish
but have no audio, or merging fails, ffmpeg is missing or not found. Confirm it
in Diagnostics and install it if needed.

## The app won't start

- Corrupt saved data can't crash the app (it's guarded), so this is rare.
- On macOS, an unsigned build may be blocked on first launch: right-click the
  app → **Open**.
- If it started before but not now, check the console output from
  `pnpm tauri dev` (in development) for a specific error.

## Nothing happens after pasting

You should see a card appear and metadata load. If not, the URL may not be
recognised as a link. Confirm it's a full URL (with `https://`). Once metadata
loads, click the **Download** button on the card to start.

## Login-required content fails

Some content requires being signed in. Provide cookies in
**Settings → Advanced → Privacy**: either import from a browser or point to a
cookies file. See [settings.md](settings.md#privacy-cookies).
