/** A completed download recorded in history. */
export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  uploader: string | null;
  platformId: string;
  formatId: string | null;
  outputDir: string;
  completedAt: number;
  status: 'completed' | 'failed';
}
