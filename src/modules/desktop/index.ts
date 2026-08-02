export { extractUrls, isTextualDrop } from './services/url-extractor';
export { filterLogs, formatLogsForExport } from './services/log-filter';
export { validateBinaryPath, type BinaryValidation } from './services/binary-validator';
export {
  inspectPreviousSession,
  beginSession,
  endSession,
  updateSessionPending,
  type RecoveryReport,
} from './services/session-recovery';
export { collectDiagnostics, type Diagnostics } from './services/diagnostics.service';
export { checkForUpdate, installUpdate, type UpdateStatus } from './services/updater.service';
export { useLogStore, log } from './stores/log.store';
export type { LogRecord, LogLevel, LogSource, LogFilter } from './types/logging.types';
export { useDragAndDrop } from './hooks/useDragAndDrop';
export { useClipboardMonitor } from './hooks/useClipboardMonitor';
export { useCrashRecovery } from './hooks/useCrashRecovery';
export { useTrayBridge } from './hooks/useTrayBridge';
export { DiagnosticsPanel } from './components/DiagnosticsPanel';
export { LogViewer } from './components/LogViewer';
export { UpdatePanel } from './components/UpdatePanel';
export { ClipboardSuggestion } from './components/ClipboardSuggestion';
export { CrashBanner } from './components/CrashBanner';
export { DropOverlay } from './components/DropOverlay';

export { applyAutostart } from './services/autostart.service';
export { useWindowBehavior } from './hooks/useWindowBehavior';
