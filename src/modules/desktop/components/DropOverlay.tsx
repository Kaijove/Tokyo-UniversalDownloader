import { AnimatePresence, motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { fade } from '@/design-system/motion/motion';

interface DropOverlayProps {
  visible: boolean;
}

/** Full-window hint shown while a drag is hovering over the app. */
export function DropOverlay({ visible }: DropOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-none fixed inset-4 z-50 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-background/80"
        >
          <Download size={28} className="text-primary" />
          <p className="text-sm text-content-primary">Drop links to download</p>
          <p className="text-xs text-content-tertiary">
            Text, .txt, .m3u playlists or browser shortcuts
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
