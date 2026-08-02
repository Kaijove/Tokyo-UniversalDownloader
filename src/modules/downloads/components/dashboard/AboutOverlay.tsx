import { motion } from 'framer-motion';
import { X, Download, Heart } from 'lucide-react';
import { backdrop, modal } from '@/design-system/motion/motion';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

interface AboutOverlayProps {
  onClose: () => void;
}

/** App version, kept in sync with package.json / tauri.conf.json. */
const VERSION = '1.0.0';

/**
 * A small About panel: what the app is, its version, and a discreet author
 * credit. Presented as an overlay like settings/history/help.
 */
export function AboutOverlay({ onClose }: AboutOverlayProps) {
  useEscapeKey(onClose);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div
        className="absolute inset-0 bg-overlay/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="About"
        className="relative z-10 flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-white/10 bg-surface/60 shadow-xl backdrop-blur-2xl"
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1 text-content-tertiary transition-colors hover:bg-white/5 hover:text-content-primary"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center px-8 py-10 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary shadow-glow">
            <Download size={30} />
          </span>

          <h2 className="mt-5 text-xl font-bold text-content-primary">Universal Downloader</h2>
          <p className="mt-1 text-sm text-content-tertiary">Versió {VERSION}</p>

          <p className="mt-4 text-sm text-content-secondary">
            Descarrega vídeo i àudio de més de 1000 plataformes, de manera ràpida i senzilla.
          </p>

          <div className="mt-6 h-px w-16 bg-border" />

          <p className="mt-6 flex items-center gap-1.5 text-sm text-content-tertiary">
            Fet amb <Heart size={13} className="text-primary" fill="currentColor" /> per
            <span className="font-semibold text-content-primary">Kai Jové</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
