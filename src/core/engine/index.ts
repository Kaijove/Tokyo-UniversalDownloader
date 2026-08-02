import { DownloadController } from './controller/download-controller';
import { engineBus } from './events/event-bus';
import { platformResolver } from './platform/platform-resolver';
import { YtDlpProvider } from './providers/ytdlp.provider';

export { engineBus } from './events/event-bus';
export type { EngineEventMap, EngineEventName } from './events/events';
export { canTransition, isTerminal, transition } from './state/state-machine';
export type { DownloadState } from './state/state-machine';
export { platformResolver } from './platform/platform-resolver';
export type { Platform, PlatformCapabilities } from './platform/platform.types';
export { useHistoryStore } from './history/history-store';
export type { HistoryEntry } from './history/history.types';
export { sanitizeUrl } from './controller/url-sanitizer';
export * from './errors/errors';

/**
 * The composition root for the download engine. Wires the concrete provider
 * into the controller and exposes a single ready-to-use instance. Swapping the
 * provider here is the only change needed to add a new backend.
 */
export const downloadController = new DownloadController(
  new YtDlpProvider(),
  engineBus,
  platformResolver,
);
