import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Inbox, SearchX, Download, CheckCircle2 } from 'lucide-react';
import { EmptyState, Button } from '@/shared/components/ui';
import { stagger } from '@/design-system/motion/motion';
import { useDownloadsStore } from '../stores/downloads.store';
import { useDashboardStore } from '../stores/dashboard.store';
import { filterAndSort } from '../utils/filter-sort';
import { DownloadCard } from './DownloadCard';
import type { DownloadItem } from '../types/download.types';

const ACTIVE_STATES = new Set(['probing', 'ready', 'queued', 'downloading', 'paused']);

/**
 * Renders downloads split into "Active" and "Completed" sections, each with a
 * count and a contextual action, mirroring the reference layout. Reuses the
 * existing filter/sort and card. Falls back to contextual empty states.
 */
export function DownloadList() {
  const items = useDownloadsStore((s) => s.items);
  const removeMany = useDownloadsStore((s) => s.removeMany);
  const { search, filter, sort } = useDashboardStore();

  const visible = useMemo(
    () => filterAndSort(items, search, filter, sort),
    [items, search, filter, sort],
  );

  const active = useMemo(
    () => visible.filter((it) => ACTIVE_STATES.has(it.status)),
    [visible],
  );
  const completed = useMemo(
    () => visible.filter((it) => it.status === 'done'),
    [visible],
  );
  const other = useMemo(
    () => visible.filter((it) => !ACTIVE_STATES.has(it.status) && it.status !== 'done'),
    [visible],
  );

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Inbox size={32} />}
        title="Encara no hi ha descàrregues"
        description="Enganxa un enllaç a dalt per començar."
      />
    );
  }

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={<SearchX size={32} />}
        title="Cap coincidència"
        description="Prova una altra cerca o filtre."
      />
    );
  }

  const clearCompleted = () => removeMany(completed.map((it) => it.id));

  return (
    <div className="flex flex-col gap-6">
      {active.length > 0 && (
        <Section
          title="Active Downloads"
          count={active.length}
          icon={<Download size={16} />}
        >
          {active}
        </Section>
      )}

      {other.length > 0 && (
        <Section title="Other" count={other.length}>
          {other}
        </Section>
      )}

      {completed.length > 0 && (
        <Section
          title="Completed"
          count={completed.length}
          icon={<CheckCircle2 size={16} />}
          action={
            <Button size="sm" variant="ghost" onClick={clearCompleted}>
              Clear all
            </Button>
          }
        >
          {completed}
        </Section>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: DownloadItem[];
}

/** One titled group of cards, with a count pill and optional action. */
function Section({ title, count, icon, action, children }: SectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <h2 className="text-lg font-bold text-content-primary">{title}</h2>
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-primary/20 px-2 text-xs font-bold text-primary">
            {count}
          </span>
        </div>
        {action}
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2"
      >
        <AnimatePresence mode="popLayout">
          {children.map((item) => (
            <DownloadCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
