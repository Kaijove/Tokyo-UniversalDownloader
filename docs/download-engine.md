# Download Engine

The queue, progress, phases, and retry logic that drive a download from
`queued` to `done`.

## Table of contents

- [Lifecycle](#lifecycle)
- [The queue & concurrency](#the-queue--concurrency)
- [Progress](#progress)
- [Phases](#phases)
- [Pause, resume, cancel](#pause-resume-cancel)
- [Retry](#retry)
- [Persistence & recovery](#persistence--recovery)

## Lifecycle

A download moves through a state machine. Illegal transitions are impossible in
correct code.

```
idle → probing → ready → queued → downloading → done
                                       │
                                       ├─▶ paused ─▶ (queued)
                                       ├─▶ cancelled
                                       └─▶ error ─▶ (retry → queued)
```

- **probing** — metadata is being fetched.
- **ready** — metadata loaded; the item shows a Download button.
- **queued** — waiting for a free concurrency slot.
- **downloading** — yt-dlp is running.
- **done / cancelled / error** — terminal (error and cancelled can retry).

## The queue & concurrency

A coordinator caps how many downloads run at once (the **Max concurrent**
setting). Extra downloads wait in `queued` and start automatically as slots
free up. Lowering the limit while downloads are active doesn't kill them — the
running ones finish, and no new ones start until there's room.

## Progress

The Rust backend runs yt-dlp with a JSON progress template and emits a
`download://progress` event on each tick. A single app-level subscription
routes those into the store, updating each card's bar, speed, and ETA — rather
than each card subscribing individually. Progress ticks are throttled where
they'd otherwise cause excess work (the tray tooltip and crash marker only
update when their meaningful value changes, not on every tick).

## Phases

Beyond a percentage, the backend parses yt-dlp's output to report a coarse
**phase**: downloading → merging → finalizing. This is emitted as
`download://phase` and shown on the card, so a long merge doesn't look frozen.

## Pause, resume, cancel

Pause and cancel kill the yt-dlp process via `stop_download`. The terminal
state is set **before** the kill, so the queue doesn't mistake the process
death for a failure and retry it. A paused download keeps its partial file and
can resume; yt-dlp's `--continue` picks up where it left off.

## Retry

Failed downloads retry automatically with exponential backoff, up to the
**Retry attempts** setting. Only *transient* errors retry — permanent ones
(e.g. "video unavailable") fail immediately. If an item is cancelled or removed
during the backoff wait, the pending retry is discarded rather than
resurrecting it.

## Persistence & recovery

The queue and history are persisted to disk. On launch they're restored;
interrupted downloads come back as `queued` (progress reset) so they restart
cleanly. Corrupt or non-array persisted data is ignored rather than crashing
the app. A crash-recovery marker distinguishes a clean exit from a crash and
surfaces a banner offering to resume.
