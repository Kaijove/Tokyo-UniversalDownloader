import { useEffect, useRef, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  Pause,
  Play,
  X,
  RotateCcw,
  Trash2,
  FolderOpen,
  FileText,
  Link2,
  Check,
  type LucideProps,
} from 'lucide-react';
import { Tooltip } from '@/shared/components/ui';
import { press, spring } from '@/design-system/motion/motion';
import { useDownloadActions } from '../../hooks/useDownloadActions';
import type { DownloadItem } from '../../types/download.types';

interface CardActionsProps {
  item: DownloadItem;
}

interface Action {
  key: string;
  label: string;
  icon: ComponentType<LucideProps>;
  run: () => void;
  danger?: boolean;
  /** When set, the icon briefly swaps to a check on click, confirming success. */
  confirms?: boolean;
}

/**
 * State-aware row of icon actions for a download card. Each action is wired to
 * the engine via `useDownloadActions`; the set shown depends on the item's
 * current status. Copy actions confirm with a brief check, and every button
 * shares the system's press/hover feedback.
 */
export function CardActions({ item }: CardActionsProps) {
  const actions = useDownloadActions();
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const confirmTimer = useRef<number | undefined>(undefined);
  const list = buildActions(item, actions);

  // Clear any pending confirmation timer if the card unmounts mid-countdown.
  useEffect(() => () => window.clearTimeout(confirmTimer.current), []);

  const handleClick = (action: Action) => {
    action.run();
    if (action.confirms) {
      setConfirmed(action.key);
      window.clearTimeout(confirmTimer.current);
      confirmTimer.current = window.setTimeout(
        () => setConfirmed((k) => (k === action.key ? null : k)),
        1200,
      );
    }
  };

  return (
    <div className="flex items-center gap-1">
      {list.map((action) => {
        const isConfirmed = confirmed === action.key;
        const Icon = isConfirmed ? Check : action.icon;
        return (
          <Tooltip key={action.key} content={action.label}>
            <motion.button
              onClick={() => handleClick(action)}
              whileTap={press}
              whileHover={{ y: -1 }}
              transition={spring.snappy}
              aria-label={action.label}
              className={`grid h-7 w-7 place-items-center rounded-md transition-colors ${
                isConfirmed
                  ? 'text-success'
                  : `text-content-tertiary hover:bg-surface-secondary ${
                      action.danger ? 'hover:text-danger' : 'hover:text-content-primary'
                    }`
              }`}
            >
              <Icon size={15} />
            </motion.button>
          </Tooltip>
        );
      })}
    </div>
  );
}

/** Builds the visible action list for an item based on its status. */
function buildActions(
  item: DownloadItem,
  a: ReturnType<typeof useDownloadActions>,
): Action[] {
  const list: Action[] = [];

  if (item.status === 'downloading') {
    list.push({ key: 'pause', label: 'Pause', icon: Pause, run: () => void a.pause(item) });
    list.push({ key: 'cancel', label: 'Cancel', icon: X, run: () => void a.cancel(item) });
  }

  if (item.status === 'paused') {
    list.push({ key: 'resume', label: 'Resume', icon: Play, run: () => a.resume(item) });
    list.push({ key: 'cancel', label: 'Cancel', icon: X, run: () => void a.cancel(item) });
  }

  if (item.status === 'error' || item.status === 'cancelled') {
    list.push({ key: 'retry', label: 'Retry', icon: RotateCcw, run: () => a.retry(item) });
  }

  if (item.status === 'done') {
    list.push({ key: 'open-file', label: 'Open file', icon: FileText, run: () => void a.openFile(item) });
    list.push({ key: 'open-folder', label: 'Open folder', icon: FolderOpen, run: () => void a.openFolder(item) });
  }

  list.push({
    key: 'copy-url',
    label: 'Copy URL',
    icon: Link2,
    run: () => a.copyUrl(item),
    confirms: true,
  });
  list.push({
    key: 'remove',
    label: 'Remove',
    icon: Trash2,
    run: () => a.remove(item.id),
    danger: true,
  });

  return list;
}
