import { useState } from 'react';
import { RefreshCw, Download, Info } from 'lucide-react';
import { relaunch } from '@tauri-apps/plugin-process';
import { Button, Card, Progress } from '@/shared/components/ui';
import { checkForUpdate, installUpdate, type UpdateStatus } from '../services/updater.service';

/**
 * Update checker.
 *
 * When no updater endpoint is configured — the current state, since the app
 * isn't published — this says so plainly rather than showing a fake "you're up
 * to date". The wiring is complete, so pointing `tauri.conf.json` at a signed
 * manifest is all that's needed to make it live.
 */
export function UpdatePanel() {
  const [status, setStatus] = useState<UpdateStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const handleCheck = async () => {
    setChecking(true);
    setStatus(await checkForUpdate());
    setChecking(false);
  };

  const handleInstall = async () => {
    if (status?.kind !== 'available') return;
    setProgress(0);
    await installUpdate(status.update, setProgress);
    await relaunch();
  };

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-content-secondary">Updates</h2>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<RefreshCw size={14} />}
          onClick={handleCheck}
          loading={checking}
        >
          Check now
        </Button>
      </div>

      {status?.kind === 'not-configured' && (
        <p className="flex items-start gap-2 rounded-md bg-surface-secondary px-3 py-2 text-xs text-content-secondary">
          <Info size={14} className="mt-0.5 shrink-0" />
          Updater is not configured. This build has no release endpoint, so there is
          nothing to check against.
        </p>
      )}

      {status?.kind === 'up-to-date' && (
        <p className="text-xs text-content-secondary">You are running the latest version.</p>
      )}

      {status?.kind === 'error' && (
        <p className="text-xs text-danger">Could not check for updates: {status.message}</p>
      )}

      {status?.kind === 'available' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-content-primary">Version {status.version} is available.</p>
          {status.notes && (
            <pre className="max-h-32 overflow-auto rounded bg-surface-secondary p-2 font-mono text-[11px] text-content-secondary">
              {status.notes}
            </pre>
          )}
          {progress === null ? (
            <Button size="sm" leftIcon={<Download size={14} />} onClick={handleInstall}>
              Download and install
            </Button>
          ) : (
            <div className="flex flex-col gap-1">
              <Progress value={progress * 100} aria-label="Update download progress" />
              <p className="text-xs text-content-tertiary">
                {Math.round(progress * 100)}% — the app will restart when finished.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
