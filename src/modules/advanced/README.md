# Advanced Download Features

Exposes yt-dlp's capabilities through typed options, without rewriting any
existing module. The queue reads these options and turns them into arguments.

## Flow

```
AdvancedOptions (UI, collapsed by default)
        │ writes
        ▼
options.store  ── defaults + per-download overrides (persisted)
        │ read by
        ▼
useDownloadQueue ──▶ buildDownloadArgs() ──▶ downloadMedia(args, template)
                     resolveOutputTemplate()          │
                     nextRetry() on failure           ▼
                                              Rust ──▶ yt-dlp (+ ffmpeg)
```

## Services

- **`args-builder.ts`** — pure translation of options into yt-dlp flags:
  format selector, playlist, audio extraction, subtitles, cookies, container,
  thumbnail/metadata embedding, rate limit. Deterministic and fully tested.
- **`template-validator.ts`** — validates filename templates: rejects absolute
  paths, `..`, illegal characters, unknown fields, and templates without
  `%(ext)s`.
- **`retry-manager.ts`** — classifies failures as transient or permanent and
  computes exponential backoff. Permanent problems (private video, disk full,
  unsupported URL) are never retried.

## Options

Video (container, quality preset, explicit format), audio (format, bitrate),
subtitles (download / embed / auto-captions / languages), thumbnails
(save / embed), metadata embedding, playlists (enable, max items, skip
existing, reverse), filename template, cookies (file or browser), rate limit,
concurrency, and retry policy.

## On FFmpeg

FFmpeg is **not** invoked directly. yt-dlp already calls it for merging,
audio extraction, container conversion and embedding — we drive that through
flags (`-x`, `--audio-format`, `--merge-output-format`, `--embed-*`). Adding a
parallel FFmpeg layer would duplicate what yt-dlp does better.

## On cookies

`--cookies-from-browser` reads your logged-in sessions. The UI shows an
explicit warning when it's enabled: it grants the downloader access to your
accounts, and it is meant for content you can already access — not for
bypassing access restrictions.

## Security

Filename templates are validated twice: in the UI for feedback, and again in
Rust (`validate_template`) as the real boundary, since anything crossing IPC
is untrusted. Output directories go through `validate_output_dir`.

## Tests

`args-builder.test.ts` (12), `template-validator.test.ts` (7) and
`retry-manager.test.ts` (8). Run with `pnpm test`.
