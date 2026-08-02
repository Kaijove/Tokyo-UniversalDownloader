import { useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Search,
  Download,
  Video,
  Music,
  Captions,
  Palette,
  Bell,
  Gauge,
  History,
  Wifi,
  Shield,
  Monitor,
  Wrench,
  RotateCcw,
  Upload,
  FileDown,
} from 'lucide-react';
import { Button, Dialog, Input, useToast } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { backdrop, modal } from '@/design-system/motion/motion';
import { useSettingsStore } from '../stores/settings.store';
import { SECTION_LABELS, searchSettings } from '../services/search-index';
import {
  GROUP_LABELS,
  GROUP_SECTIONS,
  type SettingsGroup,
} from '../constants/groups';
import type { SettingsSection } from '../types/settings.types';
import { DownloadsSection } from './sections/DownloadsSection';
import { AudioSection, SubtitlesSection, VideoSection } from './sections/MediaSections';
import {
  AdvancedSection,
  AppearanceSection,
  DesktopSection,
  HistorySection,
  NetworkSection,
  NotificationsSection,
  PerformanceSection,
  PrivacySection,
} from './sections/SystemSections';
import { DeveloperSection } from './sections/DeveloperSection';

const SECTION_ICONS: Record<SettingsSection, typeof Download> = {
  downloads: Download,
  video: Video,
  audio: Music,
  subtitles: Captions,
  appearance: Palette,
  notifications: Bell,
  performance: Gauge,
  history: History,
  network: Wifi,
  privacy: Shield,
  desktop: Monitor,
  advanced: Wrench,
};

const SECTION_COMPONENTS: Record<SettingsSection, () => ReactNode> = {
  downloads: DownloadsSection,
  video: VideoSection,
  audio: AudioSection,
  subtitles: SubtitlesSection,
  appearance: AppearanceSection,
  notifications: NotificationsSection,
  performance: PerformanceSection,
  history: HistorySection,
  network: NetworkSection,
  privacy: PrivacySection,
  desktop: DesktopSection,
  advanced: AdvancedSection,
};

const GROUP_ORDER: SettingsGroup[] = ['general', 'advanced', 'developer'];

interface SettingsOverlayProps {
  onClose: () => void;
}

/**
 * Settings as a focused overlay (Raycast-style) rather than a separate screen.
 * Sections are collapsed into three groups — General, Advanced, Developer — so
 * the common handful is immediately visible and the rest is one step away.
 * Search jumps across every setting regardless of group.
 */
export function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('downloads');
  const [query, setQuery] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const { toast } = useToast();

  const resetAll = useSettingsStore((s) => s.resetAll);
  const exportJson = useSettingsStore((s) => s.exportJson);
  const importJson = useSettingsStore((s) => s.importJson);

  // When searching, flatten to just the matching sections; otherwise show the
  // full grouped navigation.
  const searchMatches = useMemo(
    () => (query.trim() ? searchSettings(query) : []),
    [query],
  );
  const matchingSectionSet = useMemo(
    () => new Set(searchMatches.map((m) => m.section)),
    [searchMatches],
  );

  const shown =
    query.trim() && !matchingSectionSet.has(activeSection)
      ? ([...matchingSectionSet][0] ?? activeSection)
      : activeSection;

  const ActiveSection =
    shown === 'advanced' && GROUP_SECTIONS.developer.includes('advanced')
      ? DeveloperSection
      : SECTION_COMPONENTS[shown];

  const handleExport = async () => {
    await navigator.clipboard.writeText(exportJson());
    toast('Settings copied to clipboard', { tone: 'success' });
  };

  const handleImport = async () => {
    const text = await navigator.clipboard.readText();
    const result = importJson(text);
    toast(result.ok ? 'Settings imported' : 'Import failed', {
      description: result.error ?? undefined,
      tone: result.ok ? 'success' : 'danger',
    });
  };

  return (
    <motion.div
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="flex h-[min(680px,90vh)] w-[min(900px,92vw)] overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-2xl shadow-2xl"
      >
        {/* Sidebar: grouped navigation */}
        <nav
          aria-label="Settings"
          className="flex w-56 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border bg-surface-secondary/40 p-3"
        >
          <div className="px-2 pt-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search settings…"
              aria-label="Search settings"
              leftIcon={<Search size={15} />}
            />
          </div>

          {GROUP_ORDER.map((group) => {
            const sections = GROUP_SECTIONS[group].filter(
              (s) => !query.trim() || matchingSectionSet.has(s),
            );
            if (sections.length === 0) return null;

            return (
              <div key={group} className="flex flex-col gap-0.5">
                <p className="px-2 text-[11px] font-medium uppercase tracking-wide text-content-tertiary">
                  {GROUP_LABELS[group]}
                </p>
                {sections.map((section) => {
                  const Icon = SECTION_ICONS[section];
                  const label =
                    group === 'developer' ? 'Logs & Diagnostics' : SECTION_LABELS[section];
                  const isActive = section === shown;
                  return (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'bg-surface-elevated text-content-primary'
                          : 'text-content-secondary hover:bg-surface-elevated/60 hover:text-content-primary',
                      )}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium text-content-primary">
              {shown === 'advanced' ? 'Logs & Diagnostics' : SECTION_LABELS[shown]}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close settings"
              className="text-content-tertiary hover:text-content-primary"
            >
              <X size={18} />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <ActiveSection />
          </div>

          <footer className="flex items-center justify-between border-t border-border px-5 py-2.5">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" leftIcon={<FileDown size={14} />} onClick={handleExport}>
                Export
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Upload size={14} />} onClick={handleImport}>
                Import
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw size={14} />}
              onClick={() => setConfirmReset(true)}
            >
              Reset all
            </Button>
          </footer>
        </div>
      </motion.div>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all settings?"
        description="Every preference returns to its factory default. This cannot be undone."
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmReset(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              resetAll();
              setConfirmReset(false);
              toast('Settings reset');
            }}
          >
            Reset everything
          </Button>
        </div>
      </Dialog>
    </motion.div>
  );
}
