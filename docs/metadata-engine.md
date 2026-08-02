# Metadata Engine

How the app probes a URL, ranks the available formats, and caches results.

## Table of contents

- [Probing](#probing)
- [Format ranking](#format-ranking)
- [Caching](#caching)
- [Timeouts](#timeouts)

## Probing

When you paste a URL, the frontend calls the `probe_media` command, which runs
`yt-dlp --dump-single-json`. The result — title, uploader, duration, thumbnail,
and the full list of formats — is parsed into a typed structure and shown as a
rich card. Parsing is tolerant: a single malformed field (e.g. a format missing
an ID) won't fail the whole probe.

## Format ranking

The raw format list from yt-dlp is grouped and ranked for the dropdown:

- **Video + Audio / Video only / Audio only** groups.
- Within each group, sorted by resolution, then bitrate.
- Each entry shows resolution, extension, and file size when known.

The ranking makes the "best" choices float to the top so the default selection
is sensible, while still exposing every format for manual selection.

## Caching

Probe results are cached in memory with a configurable TTL (the **Metadata
cache TTL** setting). Re-pasting the same URL within the TTL is instant and
avoids re-running yt-dlp. The cache is session-scoped — cleared when the app
restarts.

## Timeouts

The probe is bounded by a socket timeout (`--socket-timeout 30`), so an
unresponsive host surfaces an error instead of leaving the card spinning
forever. A probe that times out becomes a normal error you can retry.
