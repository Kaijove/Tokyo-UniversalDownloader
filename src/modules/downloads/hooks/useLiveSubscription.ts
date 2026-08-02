import { useEffect } from 'react';
import { onLog, onPhase } from '../services/downloads.service';
import { useLiveStore } from '../stores/live.store';

/**
 * Subscribes once to phase and log events from the backend, routing them into
 * the live store. Mount a single time near the app root — not per download.
 */
export function useLiveSubscription(): void {
  const setPhase = useLiveStore((s) => s.setPhase);
  const appendLog = useLiveStore((s) => s.appendLog);

  useEffect(() => {
    let active = true;

    const phasePromise = onPhase((update) => {
      if (active) setPhase(update.id, update.phase);
    });

    const logPromise = onLog((id, level, message) => {
      if (active) appendLog({ id, level, message, timestamp: Date.now() });
    });

    return () => {
      active = false;
      void phasePromise.then((off) => off());
      void logPromise.then((off) => off());
    };
  }, [setPhase, appendLog]);
}
