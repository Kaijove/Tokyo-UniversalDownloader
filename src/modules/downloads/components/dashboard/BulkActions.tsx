import { X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui';
import { useDashboardStore } from '../../stores/dashboard.store';
import { useDownloadsStore } from '../../stores/downloads.store';

/**
 * Contextual bar shown while one or more downloads are selected. Offers bulk
 * remove and clearing the selection. Hidden when nothing is selected.
 */
export function BulkActions() {
  const selected = useDashboardStore((s) => s.selected);
  const clearSelection = useDashboardStore((s) => s.clearSelection);
  const removeMany = useDownloadsStore((s) => s.removeMany);

  if (selected.size === 0) return null;

  const handleRemove = () => {
    removeMany([...selected]);
    clearSelection();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-md border border-border bg-surface-secondary px-3 py-2"
    >
      <span className="text-sm text-content-secondary">
        {selected.size} selected
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" leftIcon={<X size={14} />} onClick={clearSelection}>
          Clear
        </Button>
        <Button variant="danger" size="sm" leftIcon={<Trash2 size={14} />} onClick={handleRemove}>
          Remove
        </Button>
      </div>
    </motion.div>
  );
}
