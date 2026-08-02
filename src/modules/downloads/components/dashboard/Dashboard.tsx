import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useDownloadsStore } from '../../stores/downloads.store';
import { UrlHero } from '../UrlHero';
import { DownloadList } from '../DownloadList';
import { QueueToolbar } from './QueueToolbar';
import { BulkActions } from './BulkActions';
import { WidgetsPanel } from './WidgetsPanel';
import { SakuraLayer } from './SakuraLayer';
import { HeroTitle } from './HeroTitle';
import tokyoBg from '@/assets/tokyo-bg.jpg';

/** Above this many downloads, the search/filter/sort toolbar appears. */
const TOOLBAR_THRESHOLD = 4;

interface DashboardProps {
  /** Optional banner rendered above the content, e.g. crash recovery. */
  banner?: ReactNode;
  /** Whether the sidebar is visible — shifts content to stay window-centered. */
  sidebarOpen?: boolean;
}

/**
 * The single main screen, composed like a landing page: a large centered hero
 * whose only job is "paste a link → download". Downloads, when they exist, flow
 * below the hero as clean cards — never the protagonist.
 */
export function Dashboard({ banner, sidebarOpen = true }: DashboardProps) {
  const count = useDownloadsStore((s) => s.items.length);
  const showToolbar = count > TOOLBAR_THRESHOLD;
  const hasDownloads = count > 0;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Ambient Tokyo background */}
      <BackgroundDecor />

      {/* Falling sakura petals — global ambient layer */}
      <SakuraLayer />

      {/* ── Scrollable content ── */}
      <div id="app-scroll" className="relative z-10 min-h-0 flex-1 overflow-y-auto">
        {/* Shift left by half the 240px sidebar so the content is centered on
            the whole window, not just the area to the right of the sidebar.
            Only on wide screens, where there's room to spare. */}
        <div
          className={cn(
            'mx-auto w-full max-w-3xl px-6 transition-transform duration-300',
            sidebarOpen && 'xl:-translate-x-[120px]',
          )}
        >
          {banner && <div className="pt-4">{banner}</div>}

          {/* Hero fills the first viewport and stays centered. Widgets and the
              downward cue sit at the bottom of it; downloads come after scroll. */}
          <section className="flex min-h-[calc(100vh-1px)] flex-col items-center justify-center text-center">
            <HeroTitle />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5 }}
              className="mt-10 w-full"
            >
              <UrlHero />
            </motion.div>

            {/* Ambient widgets — horizontal, centered. */}
            <div className="mt-10 w-full">
              <WidgetsPanel />
            </div>

            {hasDownloads && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex flex-col items-center gap-1 text-content-secondary"
                aria-hidden
              >
                <span className="text-sm font-semibold">Descàrregues anteriors</span>
                <ChevronDown size={20} className="animate-bounce text-primary" />
              </motion.div>
            )}
          </section>

          {hasDownloads && (
            <div id="downloads-section" className="pb-10">
              <h2 className="text-shadow-glow mb-4 text-center text-2xl font-bold text-content-primary">
                Descàrregues anteriors
              </h2>
              {showToolbar && (
                <div className="pb-3">
                  <QueueToolbar />
                  <BulkActions />
                </div>
              )}
              {/* Compact but readable section with its own internal scroll so the
                  page never grows without bound. */}
              <div className="max-h-[56vh] overflow-y-auto rounded-2xl border border-white/10 bg-surface/30 p-4 backdrop-blur-xl sakura-scroll">
                <DownloadList />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The Tokyo night background: the hero image, a dark gradient scrim so text
 * stays readable, and a couple of slow ambient glows on top for depth.
 */
function BackgroundDecor() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Hero image — fixed to the viewport so it always fills, regardless of
          window size, aspect ratio or scroll. object-cover crops rather than
          leaving gaps. */}
      <img
        src={tokyoBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Light readability scrim — keeps the image vibrant, just enough
          contrast at the very bottom where cards sit. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/60" />
      <div className="absolute inset-0 bg-background/15" />

      {/* Ambient glows for depth */}
      <motion.div
        className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[130px]"
        animate={reduce ? undefined : { opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-accent/15 blur-[130px]"
        animate={reduce ? undefined : { opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
