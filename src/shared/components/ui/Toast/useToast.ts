import { useCallback } from 'react';
import { useToastStore, type ToastTone } from './toast.store';

const DEFAULT_DURATION_MS = 4000;

/**
 * Returns a `toast` function that shows a transient notification and
 * auto-dismisses it. Safe to call from anywhere within the ToastProvider.
 */
export function useToast() {
  const push = useToastStore((s) => s.push);
  const dismiss = useToastStore((s) => s.dismiss);

  const toast = useCallback(
    (title: string, options?: { description?: string; tone?: ToastTone; duration?: number }) => {
      const id = push({
        title,
        description: options?.description,
        tone: options?.tone ?? 'neutral',
      });
      window.setTimeout(() => dismiss(id), options?.duration ?? DEFAULT_DURATION_MS);
      return id;
    },
    [push, dismiss],
  );

  return { toast, dismiss };
}
