import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

let permissionChecked = false;
let permitted = false;

/**
 * Ensures notification permission, asking once per session. Returns whether
 * notifications may be sent. Failures resolve to `false` rather than throwing,
 * so a denied permission never breaks a download.
 */
async function ensurePermission(): Promise<boolean> {
  if (permissionChecked) return permitted;
  permissionChecked = true;

  try {
    permitted = await isPermissionGranted();
    if (!permitted) {
      permitted = (await requestPermission()) === 'granted';
    }
  } catch {
    permitted = false;
  }
  return permitted;
}

/**
 * Sends a native desktop notification. Silently does nothing when permission
 * is unavailable — the in-app toast already covers that case.
 */
export async function notify(title: string, body: string): Promise<void> {
  if (!(await ensurePermission())) return;
  try {
    sendNotification({ title, body });
  } catch {
    // Notifications are best-effort; never surface a failure here.
  }
}
