import type { AppErrorDetail } from '../errors/errors';
import type { DownloadState } from '../state/state-machine';

/**
 * The full set of engine events mapped to their payloads. This is the single
 * source of truth for event names — never use raw strings elsewhere.
 */
export interface EngineEventMap {
  DownloadCreated: { id: string; url: string };
  MetadataLoading: { url: string };
  MetadataLoaded: { id: string; title: string };
  ThumbnailLoaded: { url: string };
  FormatsLoaded: { id: string; count: number };
  MetadataError: { url: string; message: string };
  CacheHit: { url: string };
  CacheMiss: { url: string };
  QueueUpdated: { size: number };
  DownloadStarted: { id: string };
  ProgressUpdated: { id: string; percent: number; speed: string | null; eta: string | null };
  DownloadPaused: { id: string };
  DownloadResumed: { id: string };
  DownloadCompleted: { id: string };
  DownloadCancelled: { id: string };
  DownloadFailed: { id: string; error: AppErrorDetail };
  RetryStarted: { id: string; attempt: number };
  RetryCompleted: { id: string; attempt: number };
  PlaylistDetected: { id: string; itemCount: number };
  SubtitleDownloaded: { id: string; language: string };
  ThumbnailDownloaded: { id: string };
  MergeStarted: { id: string };
  MergeCompleted: { id: string };
  ConversionStarted: { id: string; format: string };
  ConversionCompleted: { id: string; format: string };
  AuthenticationRequired: { id: string; url: string };
  BandwidthChanged: { limit: string | null };
  HistoryUpdated: { size: number };
  StateChanged: { id: string; from: DownloadState; to: DownloadState };
  SettingsChanged: { key: string };
  SettingsLoaded: { version: number };
  SettingChanged: { path: string };
  SettingsImported: { version: number };
  SettingsExported: Record<string, never>;
  SettingsReset: { section: string | null };
  ThemeChanged: { theme: string };
  PerformanceChanged: { maxConcurrent: number };
}

/** Any valid event name. */
export type EngineEventName = keyof EngineEventMap;

/** A listener for a specific event. */
export type EngineEventListener<E extends EngineEventName> = (
  payload: EngineEventMap[E],
) => void;
