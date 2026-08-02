import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button, Card, Spinner } from '@/shared/components/ui';
import { useSettingsStore } from '@/modules/settings';
import { useDownloadsStore } from '@/modules/downloads/stores/downloads.store';
import { useHistoryStore } from '@/core/engine';
import { collectDiagnostics, type Diagnostics } from '../services/diagnostics.service';
import { useLogStore } from '../stores/log.store';

/** One label/value row in the diagnostics grid. */
function Row({ label, value, status }: { label: string; value: string; status?: 'ok' | 'fail' }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-xs text-content-tertiary">{label}</span>
      <span className="flex items-center gap-1.5 font-mono text-[11px] text-content-secondary">
        {status === 'ok' && <CheckCircle2 size={12} className="text-success" />}
        {status === 'fail' && <XCircle size={12} className="text-danger" />}
        {value}
      </span>
    </div>
  );
}

/**
 * Environment and runtime diagnostics. Tool versions are read by actually
 * running the binaries, so a missing yt-dlp or FFmpeg is reported as an error
 * rather than hidden. Queue and cache figures are read from existing stores —
 * nothing here is measured twice or estimated.
 */
export function DiagnosticsPanel() {
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(true);

  const advanced = useSettingsStore((s) => s.settings.advanced);
  const items = useDownloadsStore((s) => s.items);
  const historyCount = useHistoryStore((s) => s.entries.length);
  const logCount = useLogStore((s) => s.records.length);

  const queue = useMemo(() => {
    const active = items.filter((i) => i.status === 'downloading').length;
    const queued = items.filter((i) => i.status === 'queued').length;
    return { active, queued, total: items.length };
  }, [items]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await collectDiagnostics(advanced.ytDlpPath, advanced.ffmpegPath);
    setDiagnostics(result);
    setLoading(false);
  }, [advanced.ytDlpPath, advanced.ffmpegPath]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-content-secondary">Diagnostics</h2>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<RefreshCw size={14} />}
          onClick={refresh}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {loading && !diagnostics ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : (
        diagnostics && (
          <div className="divide-y divide-border">
            <Row label="Application" value={diagnostics.appVersion} />
            <Row
              label="Operating system"
              value={`${diagnostics.os} ${diagnostics.osVersion}`}
            />
            <Row label="Architecture" value={diagnostics.architecture} />
            <Row
              label="yt-dlp"
              value={diagnostics.ytDlp.version ?? 'Not found'}
              status={diagnostics.ytDlp.version ? 'ok' : 'fail'}
            />
            <Row
              label="FFmpeg"
              value={diagnostics.ffmpeg.version ?? 'Not found'}
              status={diagnostics.ffmpeg.version ? 'ok' : 'fail'}
            />
            <Row label="Queue" value={`${queue.active} active · ${queue.queued} queued`} />
            <Row label="Tracked downloads" value={String(queue.total)} />
            <Row label="History entries" value={String(historyCount)} />
            <Row label="Log records" value={String(logCount)} />
          </div>
        )
      )}
    </Card>
  );
}
