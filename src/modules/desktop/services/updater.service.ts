import { check, type Update } from '@tauri-apps/plugin-updater';

/** Outcome of an update check. */
export type UpdateStatus =
  | { kind: 'not-configured' }
  | { kind: 'up-to-date' }
  | { kind: 'available'; version: string; notes: string | null; update: Update }
  | { kind: 'error'; message: string };

/**
 * Checks for an application update.
 *
 * The updater needs a configured endpoint serving a signed manifest. Until
 * that exists, this reports `not-configured` rather than pretending to search
 * — the UI says so plainly instead of showing a fake "up to date".
 */
export async function checkForUpdate(): Promise<UpdateStatus> {
  try {
    const update = await check();

    if (!update) {
      return { kind: 'up-to-date' };
    }

    return {
      kind: 'available',
      version: update.version,
      notes: update.body ?? null,
      update,
    };
  } catch (error) {
    const message = String(error);

    // A missing or unreachable endpoint is the expected state for an
    // unpublished build; report it honestly instead of as a failure.
    if (/endpoint|url|not configured|no such/i.test(message)) {
      return { kind: 'not-configured' };
    }
    return { kind: 'error', message };
  }
}

/**
 * Downloads and installs a pending update, reporting progress as a fraction
 * between 0 and 1. The caller is responsible for restarting the app.
 */
export async function installUpdate(
  update: Update,
  onProgress: (fraction: number) => void,
): Promise<void> {
  let downloaded = 0;
  let total = 0;

  await update.downloadAndInstall((event) => {
    if (event.event === 'Started') {
      total = event.data.contentLength ?? 0;
      return;
    }
    if (event.event === 'Progress') {
      downloaded += event.data.chunkLength;
      if (total > 0) onProgress(downloaded / total);
      return;
    }
    if (event.event === 'Finished') {
      onProgress(1);
    }
  });
}
