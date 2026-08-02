import { useEffect, useRef, useState } from 'react';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { useSettingsStore } from '@/modules/settings';
import { extractUrls } from '../services/url-extractor';

/** How often the clipboard is sampled while the feature is enabled. */
const POLL_INTERVAL_MS = 1500;

/**
 * Watches the clipboard for media URLs while the feature is enabled in
 * Settings → Desktop, and surfaces the most recent one as a suggestion.
 *
 * Privacy: the clipboard is only read while the user has opted in, nothing is
 * stored or transmitted, and only the first URL of the current clipboard is
 * held in memory. Polling stops the moment the setting is turned off.
 *
 * Returns the suggested URL and a dismiss callback; the caller decides how to
 * present it.
 */
export function useClipboardMonitor() {
  const enabled = useSettingsStore((s) => s.settings.desktop.clipboardMonitor);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  // Mirror `dismissed` in a ref so the poll loop reads the latest value without
  // being a dependency — otherwise every dismissal tears down and restarts the
  // interval, losing the de-dupe state.
  const dismissedRef = useRef(dismissed);
  dismissedRef.current = dismissed;

  useEffect(() => {
    if (!enabled) {
      setSuggestion(null);
      return;
    }

    let active = true;
    let lastSeen = '';

    const poll = async () => {
      try {
        const text = await readText();
        if (!active || !text || text === lastSeen) return;
        lastSeen = text;

        const [url] = extractUrls(text);
        if (url && !dismissedRef.current.has(url)) {
          setSuggestion(url);
        }
      } catch {
        // Clipboard access can fail (empty, or non-text content) — ignore.
      }
    };

    void poll();
    const timer = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [enabled]);

  const dismiss = () => {
    if (suggestion) {
      setDismissed((prev) => new Set(prev).add(suggestion));
    }
    setSuggestion(null);
  };

  return { suggestion, dismiss };
}
