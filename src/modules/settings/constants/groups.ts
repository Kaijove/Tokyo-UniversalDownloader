import type { SettingsSection } from '../types/settings.types';

/** The three top-level buckets settings collapse into. */
export type SettingsGroup = 'general' | 'advanced' | 'developer';

/** Human labels for each group. */
export const GROUP_LABELS: Record<SettingsGroup, string> = {
  general: 'General',
  advanced: 'Advanced',
  developer: 'Developer',
};

/** One-line description shown under each group heading. */
export const GROUP_SECTIONS: Record<SettingsGroup, SettingsSection[]> = {
  general: ['downloads', 'video', 'audio', 'appearance', 'notifications'],
  advanced: ['subtitles', 'network', 'privacy', 'performance', 'history', 'desktop'],
  developer: ['advanced'],
};
