import { AdvancedSection } from './SystemSections';
import { DiagnosticsPanel, LogViewer, UpdatePanel } from '@/modules/desktop';

/**
 * Developer group: the rarely-touched advanced overrides (custom binary paths,
 * verbose, debug) together with diagnostics, logs and updates. This is where
 * the former standalone Diagnostics screen now lives — accessible when you
 * need it, invisible otherwise.
 */
export function DeveloperSection() {
  return (
    <div className="flex flex-col gap-6">
      <AdvancedSection />
      <div className="border-t border-border pt-5">
        <DiagnosticsPanel />
      </div>
      <UpdatePanel />
      <LogViewer />
    </div>
  );
}
