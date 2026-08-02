import { open } from '@tauri-apps/plugin-dialog';
import { FolderOpen } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { validateTemplate } from '@/modules/advanced';
import { useSettingsStore } from '../../stores/settings.store';
import { SettingRow, ToggleRow } from '../SettingRow';

/** Download destination and filename settings. */
export function DownloadsSection() {
  const settings = useSettingsStore((s) => s.settings.downloads);
  const update = useSettingsStore((s) => s.updateSection);

  const templateCheck = settings.outputTemplate
    ? validateTemplate(settings.outputTemplate)
    : { valid: true, error: null };

  const pickFolder = async () => {
    const dir = await open({ directory: true, multiple: false });
    if (typeof dir === 'string') update('downloads', { defaultFolder: dir });
  };

  return (
    <div className="divide-y divide-border">
      <SettingRow
        label="Default download folder"
        description="Used when you aren't asked for a destination."
      >
        <div className="flex gap-2">
          <Input
            value={settings.defaultFolder}
            onChange={(e) => update('downloads', { defaultFolder: e.target.value })}
            placeholder="Not set"
            aria-label="Default download folder"
          />
          <Button variant="secondary" size="icon" onClick={pickFolder} aria-label="Choose folder">
            <FolderOpen size={16} />
          </Button>
        </div>
      </SettingRow>

      <ToggleRow
        label="Always ask where to save"
        description="Prompt for a destination on every download."
        checked={settings.alwaysAsk}
        onChange={(v) => update('downloads', { alwaysAsk: v })}
      />

      <ToggleRow
        label="Skip existing files"
        checked={settings.skipExisting}
        onChange={(v) => update('downloads', { skipExisting: v })}
      />

      <ToggleRow
        label="Overwrite existing files"
        description="Replace files instead of skipping them."
        checked={settings.overwrite}
        onChange={(v) => update('downloads', { overwrite: v })}
      />

      <SettingRow
        label="Filename template"
        description="Leave empty for %(title)s.%(ext)s"
      >
        <Input
          value={settings.outputTemplate}
          onChange={(e) => update('downloads', { outputTemplate: e.target.value })}
          onClear={() => update('downloads', { outputTemplate: '' })}
          placeholder="%(title)s.%(ext)s"
          aria-label="Filename template"
          error={templateCheck.error ?? undefined}
        />
      </SettingRow>
    </div>
  );
}
