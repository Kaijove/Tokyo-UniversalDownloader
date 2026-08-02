import { loadPersisted, persist } from '@/core/engine/persistence/persistence';

const SESSION_KEY = 'session-state';

/** What a stored session marker records. */
interface SessionMarker {
  /** False while the app is running; true once it shut down cleanly. */
  cleanExit: boolean;
  /** When the session was last touched. */
  updatedAt: number;
  /** How many downloads were unfinished at that point. */
  pendingDownloads: number;
}

/** Outcome of inspecting the previous session on startup. */
export interface RecoveryReport {
  /** True when the previous run did not shut down cleanly. */
  crashed: boolean;
  /** Downloads that were still pending when the app stopped. */
  pendingDownloads: number;
}

/**
 * Reads the previous session marker and reports whether the app was closed
 * unexpectedly.
 *
 * The queue and settings are already restored by the existing persistence
 * layer — this only detects *how* the last run ended, so the UI can tell the
 * user their downloads were resumed rather than silently continuing.
 */
export async function inspectPreviousSession(): Promise<RecoveryReport> {
  const marker = await loadPersisted<SessionMarker>(SESSION_KEY);

  if (!marker) {
    return { crashed: false, pendingDownloads: 0 };
  }

  return {
    crashed: !marker.cleanExit,
    pendingDownloads: marker.pendingDownloads,
  };
}

/**
 * Marks the session as running. Call once at startup, after inspecting the
 * previous marker.
 */
export async function beginSession(pendingDownloads: number): Promise<void> {
  await persist<SessionMarker>(SESSION_KEY, {
    cleanExit: false,
    updatedAt: Date.now(),
    pendingDownloads,
  });
}

/** Updates how many downloads are outstanding, so a crash report is accurate. */
export async function updateSessionPending(pendingDownloads: number): Promise<void> {
  await persist<SessionMarker>(SESSION_KEY, {
    cleanExit: false,
    updatedAt: Date.now(),
    pendingDownloads,
  });
}

/** Marks the session as cleanly finished. Call on window close. */
export async function endSession(): Promise<void> {
  await persist<SessionMarker>(SESSION_KEY, {
    cleanExit: true,
    updatedAt: Date.now(),
    pendingDownloads: 0,
  });
}
