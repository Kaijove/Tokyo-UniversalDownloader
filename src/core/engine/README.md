# Download Engine

Event-driven engine sitting between the UI and the download provider. The UI
never talks to the provider directly — it goes through the controller and
listens to typed events.

## Layers

```
UI (React)
   │  calls
   ▼
DownloadController ──▶ URL sanitizer, PlatformResolver
   │  uses                          
   ▼
DownloadProvider (interface) ──▶ YtDlpProvider ──▶ Rust ──▶ yt-dlp + ffmpeg
   │  reports via
   ▼
EventBus (typed) ──▶ stores, UI subscriptions
```

## Pieces

- **`controller/`** — `DownloadController` orchestrates: sanitise → resolve
  platform → probe via provider → emit events. Never downloads directly.
  `url-sanitizer.ts` strips tracking params and validates structure.
- **`providers/`** — `DownloadProvider` is the abstraction; `YtDlpProvider` is
  the only implementation today. Adding a backend means implementing the
  interface and swapping it in `index.ts` — nothing else changes.
- **`platform/`** — `PlatformResolver` identifies the platform and exposes
  display metadata + capability hints. Informative only; never downloads.
- **`events/`** — `EngineEventMap` is the single source of truth for event
  names; `EventBus` is strongly typed (`on`/`emit` enforce payload types).
- **`state/`** — the download state machine. `transition()` and
  `canTransition()` make illegal transitions impossible in correct code.
- **`errors/`** — `AppError` → `DownloadError` → specific errors, each with
  message, cause, severity, suggestion and timestamp. Never throw bare errors.
- **`history/`** — searchable, persisted history of finished downloads.
- **`persistence/`** — thin wrapper over the Tauri store plugin. Best-effort:
  failures never break app flow.

## Persistence & recovery

The queue and history persist to `engine.json` on disk. On startup
`useEnginePersistence` restores both; any download interrupted mid-flight is
reset to `queued` so the scheduler resumes it.

## State name mapping

The spec uses `Created/Analyzing/Queued/…`; the code uses the lowercase names
the UI already relied on: `idle`(Created), `probing`(Analyzing), `ready`,
`queued`, `downloading`, `paused`, `done`(Completed), `error`(Failed). The
state machine additionally models `completed`/`cancelled` for engine-level
transitions.

## Extending

- **New provider**: implement `DownloadProvider`, swap it in `index.ts`.
- **New platform metadata**: add an entry to the `KNOWN` table in
  `platform-resolver.ts`.
- **New event**: add it to `EngineEventMap` — every `on`/`emit` call site is
  type-checked against it.
