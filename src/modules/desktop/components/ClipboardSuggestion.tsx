import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, X } from 'lucide-react';
import { Button, Card } from '@/shared/components/ui';
import { toast as toastMotion } from '@/design-system/motion/motion';
import { useAddDownload } from '@/modules/downloads/hooks/useAddDownload';
import { useClipboardMonitor } from '../hooks/useClipboardMonitor';

/**
 * Quick-download prompt shown when a media URL is copied, if the clipboard
 * monitor is enabled in Settings. Accepting routes through the normal add
 * flow, so the URL is sanitised and probed exactly like a pasted one.
 */
export function ClipboardSuggestion() {
  const { suggestion, dismiss } = useClipboardMonitor();
  const { submit } = useAddDownload();

  const accept = async () => {
    if (!suggestion) return;
    const url = suggestion;
    dismiss();
    await submit(url);
  };

  return (
    <AnimatePresence>
      {suggestion && (
        <motion.div
          variants={toastMotion}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-4 left-1/2 z-40 w-96 -translate-x-1/2"
        >
          <Card elevation="raised" className="flex items-center gap-3 px-3 py-2.5">
            <Clipboard size={16} className="shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-content-secondary">Link copied</p>
              <p className="truncate text-xs text-content-tertiary">{suggestion}</p>
            </div>
            <Button size="sm" onClick={accept}>
              Download
            </Button>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="shrink-0 text-content-tertiary hover:text-content-primary"
            >
              <X size={14} />
            </button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
