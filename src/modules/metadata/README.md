# Metadata & URL Intelligence

Turns a canonical URL into rich, ranked, UI-ready information before any
download starts. Builds on the engine's URL sanitizer and PlatformResolver —
it doesn't re-implement them.

## Pipeline

```
sanitised URL
   │
   ▼
metadata.service  ──▶ metadata cache (memory, TTL) ─── hit ──▶ RichMetadata
   │ miss
   ▼
provider.probe (yt-dlp)  ──▶ quality-ranking ──▶ format-parser ──▶ RichMetadata
                                        emits lifecycle events throughout
```

## Pieces

- **`services/metadata.service.ts`** — orchestrates: cache lookup → probe →
  rank → cache store, emitting `MetadataLoading`, `CacheHit`/`CacheMiss`,
  `MetadataLoaded`, `FormatsLoaded`, `ThumbnailLoaded`, `MetadataError`.
- **`services/quality-ranking.ts`** — scores each format (resolution dominates,
  then bitrate, with FPS / HDR / codec bonuses). Accepts `RankingPreferences`
  to prefer high FPS, small size, or a specific codec. Pure functions.
- **`services/format-parser.ts`** — groups ranked formats into
  merged / video-only / audio-only for the UI.
- **`services/metadata-cache.ts`** — in-memory, session-scoped cache keyed by
  URL with a 10-minute TTL. Avoids duplicate probes; no disk I/O.
- **`utils/humanize.ts`** — byte / count / duration / date formatting.

## What the provider reliably returns

Title, uploader/channel, duration, thumbnail, view & like counts, upload date,
live status, age limit, playlist flag, formats (resolution/fps/codec/bitrate/
HDR/size), and subtitle tracks. Fields yt-dlp leaves empty on many sites
(category, language, copyright flags) are intentionally not surfaced.

## UI integration

`DownloadCard` shows a lazy-loaded thumbnail with a duration badge, an uploader
/ views / date line, and status badges (live, age-restricted, playlist). The
format dropdown lists formats already ranked best-first.

## Notes

- "Metadata under 1s" is a target, not a guarantee — it depends on the network
  and the site, not this code. The cache makes repeat pastes instant.
- Thumbnails are cached only by the browser engine; there is no on-disk image
  cache (unnecessary for personal use).

## Tests

`quality-ranking.test.ts` and `humanize.test.ts` cover ranking order, HDR and
codec preference, kind classification, and all humanize formatters.
Run with `pnpm test`.
