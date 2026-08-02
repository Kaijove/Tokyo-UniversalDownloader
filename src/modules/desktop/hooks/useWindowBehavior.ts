import { useEffect, useRef } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { saveWindowState, StateFlags } from '@tauri-apps/plugin-window-state';
import { useSettingsStore } from '@/modules/settings';

/**
 * Applies the three window-behaviour preferences that need to talk to the OS
 * window directly:
 *
 *   - `startMinimized` — minimise once, on first mount after settings load.
 *   - `minimizeToTray` — intercept the close request and hide instead of
 *     quitting, so the app keeps running in the tray. When off, the close
 *     proceeds normally.
 *   - `rememberWindowState` — when on, persist position/size on close so the
 *     window-state plugin restores it next launch; when off, nothing is saved.
 *
 * All calls are guarded: a failure (e.g. running outside Tauri during tests)
 * is logged and ignored so the app never breaks over a window preference.
 */
export function useWindowBehavior(): void {
  const loaded = useSettingsStore((s) => s.loaded);
  const desktop = useSettingsStore((s) => s.settings.desktop);
  const didStartMinimized = useRef(false);

  // Start minimised — once, after settings are known.
  useEffect(() => {
    if (!loaded || didStartMinimized.current) return;
    didStartMinimized.current = true;
    if (desktop.startMinimized) {
      getCurrentWindow()
        .minimize()
        .catch((err) => console.warn('Could not start minimised:', err));
    }
  }, [loaded, desktop.startMinimized]);

  // Intercept window close for minimize-to-tray and window-state saving.
  useEffect(() => {
    if (!loaded) return;
    const win = getCurrentWindow();
    let unlisten: (() => void) | undefined;

    win
      .onCloseRequested(async (event) => {
        // Persist window geometry on close only when the user opted in.
        if (desktop.rememberWindowState) {
          try {
            await saveWindowState(StateFlags.ALL);
          } catch (err) {
            console.warn('Could not save window state:', err);
          }
        }

        // Hide to tray instead of quitting, if enabled.
        if (desktop.minimizeToTray) {
          event.preventDefault();
          await win.hide().catch((err) => console.warn('Could not hide to tray:', err));
        }
      })
      .then((fn) => {
        unlisten = fn;
      })
      .catch((err) => console.warn('Could not attach close handler:', err));

    return () => unlisten?.();
  }, [loaded, desktop.minimizeToTray, desktop.rememberWindowState]);
}
