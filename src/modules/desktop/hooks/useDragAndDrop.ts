import { useEffect, useState } from 'react';
import { getCurrentWebview } from '@tauri-apps/api/webview';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { useAddDownload } from '@/modules/downloads/hooks/useAddDownload';
import { extractUrls, isTextualDrop } from '../services/url-extractor';
import { log } from '../stores/log.store';

/**
 * Enables dropping link-list files onto the window. Dropped `.txt`, `.m3u`,
 * `.m3u8`, `.url` and `.desktop` files are read and scanned for URLs, so
 * browser shortcuts and playlists work without special cases. (The OS drag-drop
 * event delivers file paths, not selected text.)
 *
 * Returns whether a drag is currently hovering, for the drop overlay.
 * Reuses `useAddDownload`, so dropped URLs go through the exact same
 * sanitise → probe → queue path as pasted ones.
 */
export function useDragAndDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const { submit } = useAddDownload();

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let active = true;

    const handlePaths = async (paths: string[]) => {
      for (const path of paths) {
        if (!isTextualDrop(path)) {
          log.warn('app', `Ignored dropped file (not a link list): ${path}`);
          continue;
        }
        try {
          const contents = await readTextFile(path);
          const urls = extractUrls(contents);
          log.info('app', `Found ${urls.length} link(s) in ${path}`);
          for (const url of urls) await submit(url);
        } catch (error) {
          log.error('app', `Could not read dropped file: ${String(error)}`);
        }
      }
    };

    void getCurrentWebview()
      .onDragDropEvent(async (event) => {
        if (!active) return;

        if (event.payload.type === 'over') {
          setIsDragging(true);
          return;
        }
        if (event.payload.type === 'leave') {
          setIsDragging(false);
          return;
        }
        if (event.payload.type === 'drop') {
          setIsDragging(false);
          await handlePaths(event.payload.paths);
        }
      })
      .then((off) => {
        unlisten = off;
      });

    return () => {
      active = false;
      unlisten?.();
    };
  }, [submit]);

  return { isDragging };
}
