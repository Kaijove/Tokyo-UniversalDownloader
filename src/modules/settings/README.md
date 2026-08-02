# Settings & Preferences

A versioned, persisted settings document plus the screen that edits it. Every
setting here has a real effect — nothing is a placeholder toggle.

## Architecture

```
SettingsScreen (sidebar + search)
      │ writes
      ▼
settings.store ──▶ clampSettings ──▶ persistence (engine.json)
      │                                   │ emits
      │                                   ▼
      │                             Event Bus (SettingChanged, ThemeChanged, …)
      ▼
useApplySettings ──┬──▶ options.store  (queue reads → yt-dlp args)
                   ├──▶ metadataCache  (TTL)
                   ├──▶ historyStore    (retention)
                   └──▶ document root   (theme, density, reduced motion)
```

## Sections

Downloads (folder, always-ask, skip/overwrite, filename template), Video
(quality, container, max resolution, codec, HDR, high FPS), Audio (format,
bitrate, metadata/thumbnail embedding), Subtitles, Appearance (theme, density,
reduced motion), Performance (concurrency, cache TTL), History (enable, max
entries), Network (proxy, bandwidth, timeout, retry policy), Privacy (cookie
browser/file), Advanced (custom yt-dlp / ffmpeg paths, verbose logs).

## Persistence & migration

Settings are stored under the `settings` key of the existing engine store, with
a `version` field. `migrateSettings` is the single entry point for both loading
and importing: it never throws, drops unknown keys, fills missing ones from
defaults, and stamps the current version — so an older or corrupt file can
never leave the app in a broken state. Bump `SETTINGS_VERSION` and extend the
migration when the shape changes.

## Search

`SETTINGS_INDEX` catalogues every control with keywords, so typing "proxy"
surfaces Network → Proxy and "srt" surfaces the subtitle options. Adding a
setting means adding one row to the index.

## Reset & import/export

Per-section reset, full reset behind a confirmation dialog, and JSON
export/import via the clipboard. Imports go through the same validation and
migration path as persisted settings.

## Scope notes

Updates (channels, auto-download), telemetry, crash reports, background
workers, queue refresh interval, loudness normalisation and DNS options were
deliberately left out: the app has no update pipeline or backend to connect
them to, so they would be controls that do nothing. They can be added when the
machinery behind them exists.

## Tests

`migration.test.ts` (10), `search-index.test.ts` (7), `apply-settings.test.ts`
(5). Run with `pnpm test`.
