import {
  Plug,
  Settings2,
  ArrowDownToLine,
  Combine,
  Music,
  Tags,
  Image,
  Captions,
  RefreshCw,
  Sparkles,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { DownloadPhase } from '../../types/live.types';

/** How a pipeline phase is presented: label, icon and whether it spins. */
export interface PhaseMeta {
  label: string;
  tooltip: string;
  icon: ComponentType<LucideProps>;
  spin: boolean;
}

/**
 * Presentation for each pipeline phase. Phases come from real provider output,
 * so a phase only ever renders once that stage has actually started.
 */
export const PHASE_META: Record<DownloadPhase, PhaseMeta> = {
  connecting: {
    label: 'Connecting',
    tooltip: 'Contacting the site and resolving the media',
    icon: Plug,
    spin: false,
  },
  preparing: {
    label: 'Preparing',
    tooltip: 'Selecting formats and preparing the download',
    icon: Settings2,
    spin: false,
  },
  downloading: {
    label: 'Downloading',
    tooltip: 'Transferring the media streams',
    icon: ArrowDownToLine,
    spin: false,
  },
  merging: {
    label: 'Merging',
    tooltip: 'Combining the video and audio streams',
    icon: Combine,
    spin: true,
  },
  'extracting-audio': {
    label: 'Extracting audio',
    tooltip: 'Converting the download to an audio file',
    icon: Music,
    spin: true,
  },
  'embedding-metadata': {
    label: 'Writing tags',
    tooltip: 'Embedding title, artist and date information',
    icon: Tags,
    spin: true,
  },
  'embedding-thumbnail': {
    label: 'Embedding cover',
    tooltip: 'Adding the thumbnail as cover art',
    icon: Image,
    spin: true,
  },
  'embedding-subtitles': {
    label: 'Embedding subtitles',
    tooltip: 'Writing subtitles into the media file',
    icon: Captions,
    spin: true,
  },
  converting: {
    label: 'Converting',
    tooltip: 'Changing the container or codec',
    icon: RefreshCw,
    spin: true,
  },
  finalizing: {
    label: 'Finalizing',
    tooltip: 'Applying final fixes to the file',
    icon: Sparkles,
    spin: true,
  },
};
