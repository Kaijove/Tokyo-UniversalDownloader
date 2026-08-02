import { useEffect, useState } from 'react';
import { useDownloadsStore } from '@/modules/downloads/stores/downloads.store';
import {
  beginSession,
  endSession,
  inspectPreviousSession,
  updateSessionPending,
  type RecoveryReport,
} from '../services/session-recovery';
import { log } from '../stores/log.store';

/**
 * Detects whether the previous run ended unexpectedly and keeps the session
 * marker current.
 *
 * The queue itself is already restored by the existing persistence layer; this
 * only tells the user *why* their downloads reappeared, and marks a clean exit
 * on window close so the next start doesn't report a false crash.
 */
export function useCrashRecovery() {
  const [report, setReport] = useState<RecoveryReport | null>(null);
  const items = useDownloadsStore((s) => s.items);

  useEffect(() => {
    void (async () => {
      const previous = await inspectPreviousSession();
      if (previous.crashed) {
        log.warn(
          'app',
          `Previous session ended unexpectedly with ${previous.pendingDownloads} unfinished download(s).`,
        );
        setReport(previous);
      }
      await beginSession(0);
    })();

    const handleUnload = () => {
      void endSession();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Keep the marker's pending count accurate so a crash report is meaningful.
  // Derive just the count and depend on that, so progress ticks (which mutate
  // items many times per second) don't trigger a disk write each time.
  const pendingCount = items.filter(
    (item) => item.status === 'queued' || item.status === 'downloading',
  ).length;
  useEffect(() => {
    void updateSessionPending(pendingCount);
  }, [pendingCount]);

  return { report, dismiss: () => setReport(null) };
}
