import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelLeft } from 'lucide-react';
import { ToastViewport } from '@/shared/components/ui';
import { SettingsOverlay, useApplySettings } from '@/modules/settings';
import {
  ClipboardSuggestion,
  DropOverlay,
  useDragAndDrop,
  useTrayBridge,
  useWindowBehavior,
} from '@/modules/desktop';
import { Dashboard } from '@/modules/downloads/components/dashboard/Dashboard';
import { Sidebar, type NavKey } from '@/modules/downloads/components/dashboard/Sidebar';
import { HistoryOverlay } from '@/modules/downloads/components/dashboard/HistoryOverlay';
import { HelpOverlay } from '@/modules/downloads/components/dashboard/HelpOverlay';
import { AboutOverlay } from '@/modules/downloads/components/dashboard/AboutOverlay';
import { useProgressSubscription } from '@/modules/downloads/hooks/useProgressSubscription';
import { useLiveSubscription } from '@/modules/downloads/hooks/useLiveSubscription';
import { useDownloadQueue } from '@/modules/downloads/hooks/useDownloadQueue';
import { useEnginePersistence } from '@/modules/downloads/hooks/useEnginePersistence';
import { useEngineNotifications } from '@/modules/downloads/hooks/useEngineNotifications';

/**
 * Root application shell. There is one screen — the dashboard — with settings
 * presented as an overlay on top of it. Diagnostics is no longer a destination;
 * it lives inside the settings Developer group.
 */
export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState<NavKey>('home');

  const handleNavigate = (key: NavKey) => {
    // History, Settings and How-it-works are overlays; the rest just highlight
    // and scroll the main view (a single-screen app under the hood).
    if (key === 'history') {
      setHistoryOpen(true);
      return;
    }
    if (key === 'settings') {
      setSettingsOpen(true);
      return;
    }
    if (key === 'help') {
      setHelpOpen(true);
      return;
    }
    if (key === 'about') {
      setAboutOpen(true);
      return;
    }
    setActiveNav(key);
    const scroller = document.getElementById('app-scroll');
    if (key === 'downloads') {
      document
        .getElementById('downloads-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Home (and anything else) returns to the very top.
      scroller?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useProgressSubscription();
  useLiveSubscription();
  useDownloadQueue();
  useEnginePersistence();
  useEngineNotifications();
  useApplySettings();
  useWindowBehavior();

  const { isDragging } = useDragAndDrop();
  useTrayBridge({
    onOpenSettings: () => setSettingsOpen(true),
    onOpenHistory: () => setHistoryOpen(true),
  });

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="h-full overflow-hidden"
            >
              <Sidebar active={activeNav} onNavigate={handleNavigate} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* When collapsed, a floating button brings the panel back. */}
        <AnimatePresence>
          {!sidebarOpen && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Mostra el panell"
              className="fixed left-3 top-3 z-30 grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-surface/50 text-content-secondary backdrop-blur-xl transition-colors hover:bg-surface/70 hover:text-content-primary"
            >
              <PanelLeft size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <Dashboard sidebarOpen={sidebarOpen} />
        </div>
      </div>

      <AnimatePresence>
        {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {historyOpen && <HistoryOverlay onClose={() => setHistoryOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {aboutOpen && <AboutOverlay onClose={() => setAboutOpen(false)} />}
      </AnimatePresence>

      <DropOverlay visible={isDragging} />
      <ClipboardSuggestion />
      <ToastViewport />
    </>
  );
}
