import { Input, Select } from '@/shared/components/ui';
import { COOKIE_BROWSERS } from '@/modules/advanced';
import { validateBinaryPath } from '@/modules/desktop';
import { useSettingsStore } from '../../stores/settings.store';
import type { Density, ThemePreference } from '../../types/settings.types';
import { SettingRow, ToggleRow } from '../SettingRow';

/** Theme, density and motion preferences. */
export function AppearanceSection() {
  const settings = useSettingsStore((s) => s.settings.appearance);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="divide-y divide-border">
      <SettingRow label="Theme">
        <Select
          value={settings.theme}
          onChange={(e) => update('appearance', { theme: e.target.value as ThemePreference })}
          aria-label="Theme"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">Follow system</option>
        </Select>
      </SettingRow>

      <SettingRow label="Interface density">
        <Select
          value={settings.density}
          onChange={(e) => update('appearance', { density: e.target.value as Density })}
          aria-label="Interface density"
        >
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
        </Select>
      </SettingRow>

      <ToggleRow
        label="Reduce motion"
        description="Minimise animation regardless of your system setting."
        checked={settings.reduceMotion}
        onChange={(v) => update('appearance', { reduceMotion: v })}
      />
    </div>
  );
}

/** Queue concurrency and cache tuning. */
export function PerformanceSection() {
  const settings = useSettingsStore((s) => s.settings.performance);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="divide-y divide-border">
      <SettingRow
        label="Simultaneous downloads"
        description="How many downloads run at the same time."
      >
        <Select
          value={settings.maxConcurrent}
          onChange={(e) => update('performance', { maxConcurrent: Number(e.target.value) })}
          aria-label="Simultaneous downloads"
        >
          {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </SettingRow>

      <SettingRow
        label="Metadata cache lifetime"
        description="How long resolved metadata stays fresh."
      >
        <Select
          value={settings.metadataCacheTtlMinutes}
          onChange={(e) =>
            update('performance', { metadataCacheTtlMinutes: Number(e.target.value) })
          }
          aria-label="Metadata cache lifetime"
        >
          {[1, 5, 10, 30, 60, 240].map((n) => (
            <option key={n} value={n}>
              {n} minutes
            </option>
          ))}
        </Select>
      </SettingRow>
    </div>
  );
}

/** History retention settings. */
export function HistorySection() {
  const settings = useSettingsStore((s) => s.settings.history);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="divide-y divide-border">
      <ToggleRow
        label="Keep history"
        description="Record completed downloads."
        checked={settings.enabled}
        onChange={(v) => update('history', { enabled: v })}
      />

      <SettingRow
        label="Maximum entries"
        description="Older entries are removed once the limit is reached."
      >
        <Select
          value={settings.maxEntries}
          onChange={(e) => update('history', { maxEntries: Number(e.target.value) })}
          aria-label="Maximum history entries"
        >
          {[50, 100, 500, 1000, 5000].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </SettingRow>
    </div>
  );
}

/** Proxy, timeout and retry policy. */
export function NetworkSection() {
  const settings = useSettingsStore((s) => s.settings.network);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="divide-y divide-border">
      <SettingRow label="Proxy" description="Leave empty for a direct connection.">
        <Input
          value={settings.proxy}
          onChange={(e) => update('network', { proxy: e.target.value })}
          onClear={() => update('network', { proxy: '' })}
          placeholder="http://127.0.0.1:8080"
          aria-label="Proxy"
        />
      </SettingRow>

      <SettingRow label="Bandwidth limit" description="For example 2M or 500K.">
        <Input
          value={settings.rateLimit}
          onChange={(e) => update('network', { rateLimit: e.target.value })}
          onClear={() => update('network', { rateLimit: '' })}
          placeholder="Unlimited"
          aria-label="Bandwidth limit"
        />
      </SettingRow>

      <SettingRow label="Timeout">
        <Select
          value={settings.timeoutSeconds}
          onChange={(e) => update('network', { timeoutSeconds: Number(e.target.value) })}
          aria-label="Timeout"
        >
          {[10, 30, 60, 120, 300].map((n) => (
            <option key={n} value={n}>
              {n} seconds
            </option>
          ))}
        </Select>
      </SettingRow>

      <SettingRow label="Retry attempts">
        <Select
          value={settings.retryAttempts}
          onChange={(e) => update('network', { retryAttempts: Number(e.target.value) })}
          aria-label="Retry attempts"
        >
          {[0, 1, 2, 3, 5, 10].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </SettingRow>

      <SettingRow label="Retry delay" description="Doubles after each attempt.">
        <Select
          value={settings.retryDelayMs}
          onChange={(e) => update('network', { retryDelayMs: Number(e.target.value) })}
          aria-label="Retry delay"
        >
          {[500, 1000, 2000, 5000, 10000].map((n) => (
            <option key={n} value={n}>
              {n / 1000}s
            </option>
          ))}
        </Select>
      </SettingRow>
    </div>
  );
}

/** Cookie and session handling. */
export function PrivacySection() {
  const settings = useSettingsStore((s) => s.settings.privacy);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="flex flex-col gap-2">
      <div className="divide-y divide-border">
        <SettingRow
          label="Cookies from browser"
          description="Read your logged-in session from a browser profile."
        >
          <Select
            value={settings.cookieBrowser}
            onChange={(e) => update('privacy', { cookieBrowser: e.target.value })}
            aria-label="Cookies from browser"
          >
            <option value="">None</option>
            {COOKIE_BROWSERS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </SettingRow>

        <SettingRow label="Cookie file" description="Path to a Netscape cookies.txt file.">
          <Input
            value={settings.cookieFile}
            onChange={(e) => update('privacy', { cookieFile: e.target.value })}
            onClear={() => update('privacy', { cookieFile: '' })}
            placeholder="Not set"
            aria-label="Cookie file"
          />
        </SettingRow>
      </div>

      {(settings.cookieBrowser || settings.cookieFile) && (
        <p className="rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
          Cookies grant access to your logged-in accounts. Use this only for content you
          can already access with that account.
        </p>
      )}
    </div>
  );
}

/** Custom binary paths and debugging. */
export function AdvancedSection() {
  const settings = useSettingsStore((s) => s.settings.advanced);
  const update = useSettingsStore((s) => s.updateSection);

  const ytDlpCheck = validateBinaryPath(settings.ytDlpPath);
  const ffmpegCheck = validateBinaryPath(settings.ffmpegPath);

  return (
    <div className="divide-y divide-border">
      <SettingRow
        label="Custom yt-dlp path"
        description="Leave empty to use the one on your PATH."
      >
        <Input
          value={settings.ytDlpPath}
          onChange={(e) => update('advanced', { ytDlpPath: e.target.value })}
          onClear={() => update('advanced', { ytDlpPath: '' })}
          placeholder="yt-dlp"
          aria-label="Custom yt-dlp path"
          error={ytDlpCheck.error ?? undefined}
        />
      </SettingRow>

      <SettingRow
        label="Custom FFmpeg path"
        description="Leave empty to use the one on your PATH."
      >
        <Input
          value={settings.ffmpegPath}
          onChange={(e) => update('advanced', { ffmpegPath: e.target.value })}
          onClear={() => update('advanced', { ffmpegPath: '' })}
          placeholder="ffmpeg"
          aria-label="Custom FFmpeg path"
          error={ffmpegCheck.error ?? undefined}
        />
      </SettingRow>

      <ToggleRow
        label="Verbose logs"
        description="Ask the downloader for detailed output."
        checked={settings.verboseLogs}
        onChange={(v) => update('advanced', { verboseLogs: v })}
      />

      <ToggleRow
        label="Debug mode"
        description="Record debug-level entries in the application log."
        checked={settings.debugMode}
        onChange={(v) => update('advanced', { debugMode: v })}
      />
    </div>
  );
}

/** Desktop notification preferences. */
export function NotificationsSection() {
  const settings = useSettingsStore((s) => s.settings.notifications);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="divide-y divide-border">
      <ToggleRow
        label="Notify on completion"
        description="Show a desktop notification when a download finishes."
        checked={settings.onComplete}
        onChange={(v) => update('notifications', { onComplete: v })}
      />

      <ToggleRow
        label="Notify on failure"
        description="Show a desktop notification when a download fails."
        checked={settings.onFailure}
        onChange={(v) => update('notifications', { onFailure: v })}
      />
    </div>
  );
}

/** Desktop integration: startup, tray and clipboard. */
export function DesktopSection() {
  const settings = useSettingsStore((s) => s.settings.desktop);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="divide-y divide-border">
      <ToggleRow
        label="Launch at startup"
        description="Start the app automatically when you log in."
        checked={settings.launchAtStartup}
        onChange={(v) => update('desktop', { launchAtStartup: v })}
      />

      <ToggleRow
        label="Start minimized"
        description="Start hidden in the tray instead of showing the window."
        checked={settings.startMinimized}
        onChange={(v) => update('desktop', { startMinimized: v })}
      />

      <ToggleRow
        label="Minimize to tray on close"
        description="Closing the window keeps downloads running in the background."
        checked={settings.minimizeToTray}
        onChange={(v) => update('desktop', { minimizeToTray: v })}
      />

      <ToggleRow
        label="Watch clipboard for links"
        description="Offer a quick download when you copy a media URL. Nothing is sent anywhere."
        checked={settings.clipboardMonitor}
        onChange={(v) => update('desktop', { clipboardMonitor: v })}
      />

      <ToggleRow
        label="Remember window size and position"
        checked={settings.rememberWindowState}
        onChange={(v) => update('desktop', { rememberWindowState: v })}
      />
    </div>
  );
}
