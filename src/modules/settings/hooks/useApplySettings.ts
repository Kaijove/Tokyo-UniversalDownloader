import { useEffect } from 'react';
import { useOptionsStore } from '@/modules/advanced';
import { metadataCache } from '@/modules/metadata';
import { useHistoryStore } from '@/core/engine';
import { useLogStore, applyAutostart } from '@/modules/desktop';
import { useSettingsStore } from '../stores/settings.store';
import { settingsToDownloadOptions } from '../services/apply-settings';

/**
 * Keeps the download options in sync with user settings and applies the theme
 * to the document. Mount once at the app root: every settings change flows
 * through here into the rest of the app, with no restart required.
 */
export function useApplySettings(): void {
  const settings = useSettingsStore((s) => s.settings);
  const loaded = useSettingsStore((s) => s.loaded);

  // Project settings onto the download options the queue reads.
  useEffect(() => {
    if (!loaded) return;
    const current = useOptionsStore.getState().defaults;
    useOptionsStore.setState({
      defaults: settingsToDownloadOptions(settings, current),
    });
  }, [settings, loaded]);

  // Apply the metadata cache lifetime.
  useEffect(() => {
    metadataCache.setTtlMinutes(settings.performance.metadataCacheTtlMinutes);
  }, [settings.performance.metadataCacheTtlMinutes]);

  // Apply the history retention limit.
  useEffect(() => {
    useHistoryStore.getState().setMaxEntries(settings.history.maxEntries);
  }, [settings.history.maxEntries]);

  // Apply debug logging.
  useEffect(() => {
    useLogStore.getState().setDebugMode(settings.advanced.debugMode);
  }, [settings.advanced.debugMode]);

  // Register or unregister OS autostart to match the preference. Guarded inside
  // the service so an unsupported platform never breaks the effect.
  useEffect(() => {
    if (!loaded) return;
    void applyAutostart(settings.desktop.launchAtStartup);
  }, [settings.desktop.launchAtStartup, loaded]);

  // Apply the theme, following the OS when set to `system`.
  useEffect(() => {
    const { theme } = settings.appearance;
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark'
        : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  }, [settings.appearance.theme, settings.appearance]);

  // Reflect density and reduced-motion preferences on the root element so CSS
  // and components can respond without prop drilling.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-density', settings.appearance.density);
    root.toggleAttribute('data-reduce-motion', settings.appearance.reduceMotion);
  }, [settings.appearance.density, settings.appearance.reduceMotion]);
}
