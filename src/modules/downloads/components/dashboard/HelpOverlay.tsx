import { motion } from 'framer-motion';
import { X, Link2, ClipboardPaste, SlidersHorizontal, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { backdrop, modal } from '@/design-system/motion/motion';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

interface HelpOverlayProps {
  onClose: () => void;
}

const STEPS = [
  {
    icon: Link2,
    n: '01',
    title: 'Copia un enllaç',
    body: "Copia l'enllaç del vídeo que vulguis descarregar.",
  },
  {
    icon: ClipboardPaste,
    n: '02',
    title: "Enganxa'l",
    body: "Enganxa'l al camp de dalt de Universal Downloader.",
  },
  {
    icon: SlidersHorizontal,
    n: '03',
    title: 'Tria la qualitat',
    body: 'Escull Automàtic, 1080p, 720p o només àudio.',
  },
  {
    icon: Download,
    n: '04',
    title: 'Descarrega',
    body: 'Prem Descarregar i espera. Ja el tens.',
  },
];

const FAQ = [
  {
    q: 'Quines plataformes són compatibles?',
    a: 'La majoria de webs de vídeo populars, com YouTube i moltes altres.',
  },
  {
    q: 'On es guarden els vídeos?',
    a: "A la carpeta que triïs. Pots canviar-la a Configuració → General.",
  },
  {
    q: 'Què passa si una descàrrega falla?',
    a: "T'ho explica en paraules senzilles i pots tornar-ho a provar amb un clic.",
  },
  {
    q: 'Necessito instal·lar res?',
    a: "Les eines de descàrrega (yt-dlp i ffmpeg). Un cop instal·lades, l'app les troba sola.",
  },
];

/**
 * A friendly, non-technical explainer. Presented as an overlay like settings
 * and history, so it never occupies the main screen.
 */
export function HelpOverlay({ onClose }: HelpOverlayProps) {
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
        aria-label="How it works"
        className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-2xl shadow-xl"
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <h2 className="text-base font-semibold text-content-primary">Com funciona?</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {/* Steps */}
          <div className="grid gap-3 sm:grid-cols-2">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="flex gap-4 rounded-lg border border-border/60 bg-surface-secondary/50 p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <step.icon size={20} />
                </span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-primary">{step.n}</span>
                    <h3 className="text-sm font-semibold text-content-primary">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-content-secondary">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-semibold text-content-primary">
              Preguntes freqüents
            </h3>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <div key={item.q} className="rounded-lg border border-border/60 p-4">
                  <p className="text-sm font-medium text-content-primary">{item.q}</p>
                  <p className="mt-1 text-sm text-content-secondary">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="border-t border-border/60 px-6 py-4">
          <Button variant="primary" onClick={onClose} className="w-full sm:w-auto">
            Entesos
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
}
