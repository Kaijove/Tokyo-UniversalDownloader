import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownToLine, Link2, SlidersHorizontal, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { collapse } from '@/design-system/motion/motion';
import { AdvancedOptions } from '@/modules/advanced';
import { useAddDownload } from '../hooks/useAddDownload';
import { QualityPicker } from './QualityPicker';
import { SupportedPlatforms } from './SupportedPlatforms';

/** Loose check that there's something link-shaped in the field. */
function looksLikeUrl(v: string): boolean {
  return /https?:\/\/\S+/i.test(v.trim());
}

/**
 * The hero input — the single most prominent element on screen. A large glass
 * field with the Download button built into its right edge, quality choices
 * just beneath, and every technical option tucked behind a discreet "Options"
 * toggle. Submits on Enter or the button.
 */
export function UrlHero() {
  const { submit, pending } = useAddDownload();
  const [value, setValue] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [focused, setFocused] = useState(false);
  const valid = looksLikeUrl(value);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    await submit(value);
    setValue('');
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {/* The field */}
      <div
        className={cn(
          'group relative flex items-center gap-2 rounded-2xl border bg-surface/30 p-2 pl-4 backdrop-blur-xl transition-all duration-200',
          focused
            ? 'border-primary/60 shadow-glow'
            : 'border-white/15 hover:border-white/25',
        )}
      >
        <Link2
          size={20}
          className={cn(
            'shrink-0 transition-colors',
            valid ? 'text-primary' : 'text-content-tertiary',
          )}
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enganxa un enllaç de vídeo, àudio o playlist…"
          aria-label="Media URL"
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-content-primary outline-none placeholder:text-content-tertiary"
        />

        {/* Valid-link tick */}
        <AnimatePresence>
          {valid && !pending && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/15 text-success"
              aria-hidden
            >
              <Check size={14} />
            </motion.span>
          )}
        </AnimatePresence>

        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={pending || !value.trim()}
          loading={pending}
          className="h-11 shrink-0 rounded-xl px-5"
        >
          {!pending && <ArrowDownToLine size={18} />}
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>

      {/* Quality + options row */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <QualityPicker />
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced}
          className={cn(
            'flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-content-tertiary transition-colors hover:border-border-hover hover:text-content-primary',
            showAdvanced && 'border-primary/50 text-content-primary',
          )}
        >
          <SlidersHorizontal size={14} />
          Options
        </button>
      </div>

      {/* Advanced, hidden by default */}
      <AnimatePresence initial={false}>
        {showAdvanced && (
          <motion.div
            variants={collapse}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-surface/50 p-4 backdrop-blur-sm">
              <AdvancedOptions />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supported platforms */}
      <div className="pt-1">
        <SupportedPlatforms />
      </div>
    </div>
  );
}
