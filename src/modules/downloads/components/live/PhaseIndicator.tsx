import { Tooltip } from '@/shared/components/ui';
import { useLiveStore } from '../../stores/live.store';
import { PHASE_META } from './phase-meta';

interface PhaseIndicatorProps {
  id: string;
}

/**
 * Shows the download's current pipeline phase, with an explanatory tooltip.
 * Renders nothing until the backend has reported a phase, so it never invents
 * a stage that isn't happening.
 */
export function PhaseIndicator({ id }: PhaseIndicatorProps) {
  const phase = useLiveStore((s) => s.phases[id]);
  if (!phase) return null;

  const meta = PHASE_META[phase];
  const Icon = meta.icon;

  return (
    <Tooltip content={meta.tooltip}>
      <span className="inline-flex items-center gap-1.5 text-xs text-content-secondary">
        <Icon size={13} className={meta.spin ? 'animate-spin' : undefined} />
        {meta.label}
      </span>
    </Tooltip>
  );
}
