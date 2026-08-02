# Live Download Experience

Extends the existing card with real-time pipeline detail. Everything shown here
comes from actual provider output — no simulated stages.

## Where live data comes from

```
yt-dlp stdout/stderr
      │ parsed in Rust (detect_phase)
      ▼
download://phase  ──▶ live.store.phases  ──▶ PhaseIndicator
download://log    ──▶ live.store.logs    ──▶ LiveLog
download://progress ─▶ downloads.store   ──▶ ProgressDetails
```

`detect_phase` recognises yt-dlp's bracketed stage prefixes (`[Merger]`,
`[ExtractAudio]`, `[EmbedThumbnail]`, …) and emits a stable phase key. A phase
only ever renders once that stage has actually started.

## Components

- **`PhaseIndicator`** — current phase with icon and tooltip. Renders nothing
  until a phase arrives.
- **`MediaBadges`** — resolution, FPS, HDR, codecs, container and subtitle
  count for the selected format. Each badge is omitted when unknown.
- **`DetailsPanel`** — expandable technical view: URL, output folder, channel,
  duration, format, codecs, bitrate, estimated size, subtitle languages, plus
  the live log.
- **`LiveLog`** — collapsible per-download log, bounded to 200 lines in the
  store so long downloads can't grow memory without limit.
- **`ErrorPanel`** — human explanation, likely reason, suggested fix, retry
  button and the raw message behind a disclosure.

## Error explanations

`explain-error.ts` maps raw provider output to actionable text (private video,
removed, geo-blocked, age-restricted, rate-limited, disk full, permissions,
missing ffmpeg/yt-dlp, unsupported URL, network). Retryability comes from the
shared `isRetryable` classifier, so the button matches what the automatic retry
logic would do.

## State separation

Phases and logs live in `live.store`, not the download store. Log lines arrive
several times a second; keeping them separate means a card only re-renders when
its own item or phase changes, not on every log line.

## Desktop notifications

`notifications.service.ts` wraps the Tauri notification plugin, asking for
permission once per session and failing silently if denied. Completion and
failure notifications respect Settings → Notifications.

## Scope notes

List virtualization was left out again: cards are memoised and the list is a
memoised map, which is ample for personal use. Glassmorphism is used only on
the dialog overlay, per the design system's guidance against it elsewhere.

## Tests

`explain-error.test.ts` (11) covers every explanation rule, rule precedence and
the generic fallback.
