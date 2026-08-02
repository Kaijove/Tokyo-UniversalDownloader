import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Bell, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { toast as toastMotion } from '@/design-system/motion/motion';
import { useToastStore, type ToastTone } from './toast.store';

const TONE_ICON: Record<ToastTone, typeof Info> = {
  neutral: Bell,
  success: CheckCircle2,
  danger: AlertCircle,
  info: Info,
};

const TONE_COLOR: Record<ToastTone, string> = {
  neutral: 'text-content-secondary',
  success: 'text-success',
  danger: 'text-danger',
  info: 'text-info',
};

/**
 * Renders the live toast stack in a fixed bottom-right region. Mount once at
 * the app root, inside the same tree as any `useToast` caller.
 */
export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = TONE_ICON[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              variants={toastMotion}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-surface-elevated p-3 shadow-lg"
            >
              <Icon size={18} className={cn('mt-0.5 shrink-0', TONE_COLOR[t.tone])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-content-primary">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-content-secondary">{t.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="shrink-0 text-content-tertiary hover:text-content-primary transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
