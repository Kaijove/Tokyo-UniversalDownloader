import { useEffect } from 'react';

/**
 * Calls `onEscape` whenever the Escape key is pressed while mounted. Used by
 * overlays so they can be dismissed with the keyboard.
 */
export function useEscapeKey(onEscape: () => void): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onEscape]);
}
