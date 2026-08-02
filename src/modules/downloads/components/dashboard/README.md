# Main Screen (Dashboard)

One screen, built around a single job: paste a link and download it. Everything
else is deliberately kept off the default view.

## Layout

```
Dashboard
├── header          minimal — title + history + settings icons
├── UrlInput        THE HERO — large paste field
│   └── AdvancedOptions   tucked behind a toggle inside the input
├── QueueToolbar    conditional — only when > 4 downloads
│   └── BulkActions
└── DownloadList    the downloads, or a guiding empty state
```

## Design decisions

- **The input is the hero.** It's the largest element and sits front and
  centre, so a first-time user knows what to do immediately.
- **Advanced options left the layout.** They live behind a toggle *inside* the
  input (the sliders icon), so the common path is a single field and power
  users are one click away.
- **The toolbar is conditional.** Search / filter / sort only appear once there
  are more than `TOOLBAR_THRESHOLD` downloads — with a handful, it's noise.
- **History is an overlay,** not an embedded panel. It never occupies the main
  screen; the history icon in the header opens it (see `HistoryOverlay`).
- **Settings is an overlay** too (see `SettingsOverlay`), so opening it never
  navigates away from the downloads.
- **No diagnostics screen.** Diagnostics moved into Settings → Developer.

## What was removed

`StatusBar` and the always-embedded `HistoryPanel` were removed from the main
screen. `HistoryPanel` is now reused inside `HistoryOverlay`; the status
summary was redundant with the per-card state and the (conditional) toolbar.

## State

All state comes from the existing stores unchanged — this is composition, not
new logic. `dashboard.store` still holds search / filter / sort / selection.
