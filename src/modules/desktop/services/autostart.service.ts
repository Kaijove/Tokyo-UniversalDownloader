import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

/**
 * Reconciles the OS autostart registration with the user's preference.
 *
 * Wrapped so a failure (unsupported platform, missing permission) never throws
 * into React effects — autostart is a convenience, not a critical path. Only
 * toggles when the current OS state differs from the desired one, avoiding
 * redundant writes to the registry / launch agent on every settings change.
 */
export async function applyAutostart(desired: boolean): Promise<void> {
  try {
    const current = await isEnabled();
    if (current === desired) return;
    if (desired) {
      await enable();
    } else {
      await disable();
    }
  } catch (err) {
    // Non-fatal: log and move on.
    console.warn('Could not apply autostart preference:', err);
  }
}
