import { motion } from 'framer-motion';
import { Sparkles, Music, Shield, Feather } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useOptionsStore } from '@/modules/advanced';
import type { DownloadMode, QualityPreset } from '@/modules/advanced';

/**
 * Human quality choices, mapped straight onto the existing options store
 * (`mode` + `quality`) — no new backend concepts, no second source of truth.
 * "Auto" is the default. Exact format IDs and containers stay in Advanced.
 */
type Choice = {
  id: string;
  label: string;
  icon: typeof Sparkles;
  mode: DownloadMode;
  quality: QualityPreset;
};

const CHOICES: Choice[] = [
  { id: 'auto', label: 'Automàtic', icon: Sparkles, mode: 'video', quality: 'best' },
  {
    id: 'compatible',
    label: 'Compatible',
    icon: Shield,
    mode: 'video',
    quality: 'best-compatible',
  },
  { id: 'light', label: 'Més lleuger', icon: Feather, mode: 'video', quality: 'smallest' },
  { id: 'audio', label: 'Àudio', icon: Music, mode: 'audio', quality: 'best' },
];

/** Derives the active chip from current options, so it always stays in sync. */
function activeId(mode: string, quality: string): string {
  if (mode === 'audio') return 'audio';
  if (quality === 'best-compatible') return 'compatible';
  if (quality === 'smallest') return 'light';
  return 'auto';
}

export function QualityPicker() {
  const mode = useOptionsStore((s) => s.defaults.mode);
  const quality = useOptionsStore((s) => s.defaults.quality);
  const setDefaults = useOptionsStore((s) => s.setDefaults);
  const active = activeId(mode, quality);

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Qualitat">
      {CHOICES.map((choice) => {
        const isActive = choice.id === active;
        const Icon = choice.icon;
        return (
          <button
            key={choice.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setDefaults({ mode: choice.mode, quality: choice.quality })}
            className={cn(
              'relative flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
              isActive
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border bg-surface-secondary/50 text-content-secondary hover:border-border-hover hover:text-content-primary',
            )}
          >
            <Icon size={14} />
            <span>{choice.label}</span>
            {isActive && (
              <motion.span
                layoutId="quality-active-glow"
                className="absolute inset-0 -z-10 rounded-full shadow-glow"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
