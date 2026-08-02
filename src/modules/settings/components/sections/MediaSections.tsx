import { Input, Select } from '@/shared/components/ui';
import {
  AUDIO_BITRATES,
  AUDIO_FORMATS,
  VIDEO_CONTAINERS,
  type AudioFormat,
  type QualityPreset,
  type VideoContainer,
} from '@/modules/advanced';
import { useSettingsStore } from '../../stores/settings.store';
import { CODEC_CHOICES, RESOLUTION_CHOICES } from '../../constants/defaults';
import { SettingRow, ToggleRow } from '../SettingRow';

/** Video quality, container and codec preferences. */
export function VideoSection() {
  const settings = useSettingsStore((s) => s.settings.video);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="divide-y divide-border">
      <SettingRow label="Preferred quality">
        <Select
          value={settings.quality}
          onChange={(e) => update('video', { quality: e.target.value as QualityPreset })}
          aria-label="Preferred quality"
        >
          <option value="best">Best available</option>
          <option value="best-compatible">Best compatible (H.264)</option>
          <option value="smallest">Smallest file</option>
        </Select>
      </SettingRow>

      <SettingRow label="Preferred container">
        <Select
          value={settings.container}
          onChange={(e) => update('video', { container: e.target.value as VideoContainer })}
          aria-label="Preferred container"
        >
          {VIDEO_CONTAINERS.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </Select>
      </SettingRow>

      <SettingRow label="Maximum resolution">
        <Select
          value={settings.maxHeight ?? ''}
          onChange={(e) =>
            update('video', { maxHeight: e.target.value ? Number(e.target.value) : null })
          }
          aria-label="Maximum resolution"
        >
          {RESOLUTION_CHOICES.map((r) => (
            <option key={String(r.value)} value={r.value ?? ''}>
              {r.label}
            </option>
          ))}
        </Select>
      </SettingRow>

      <SettingRow label="Preferred codec">
        <Select
          value={settings.preferredCodec ?? ''}
          onChange={(e) => update('video', { preferredCodec: e.target.value || null })}
          aria-label="Preferred codec"
        >
          {CODEC_CHOICES.map((c) => (
            <option key={String(c.value)} value={c.value ?? ''}>
              {c.label}
            </option>
          ))}
        </Select>
      </SettingRow>

      <ToggleRow
        label="Prefer HDR"
        description="Rank HDR formats above SDR when available."
        checked={settings.preferHdr}
        onChange={(v) => update('video', { preferHdr: v })}
      />

      <ToggleRow
        label="Prefer high frame rate"
        description="Favour 50/60fps formats over 30fps."
        checked={settings.preferHighFps}
        onChange={(v) => update('video', { preferHighFps: v })}
      />
    </div>
  );
}

/** Audio format, bitrate and tagging preferences. */
export function AudioSection() {
  const settings = useSettingsStore((s) => s.settings.audio);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="divide-y divide-border">
      <SettingRow label="Audio format" description="Used when extracting audio.">
        <Select
          value={settings.format}
          onChange={(e) => update('audio', { format: e.target.value as AudioFormat })}
          aria-label="Audio format"
        >
          {AUDIO_FORMATS.map((f) => (
            <option key={f} value={f}>
              {f.toUpperCase()}
            </option>
          ))}
        </Select>
      </SettingRow>

      <SettingRow label="Audio bitrate">
        <Select
          value={settings.bitrateKbps ?? ''}
          onChange={(e) =>
            update('audio', { bitrateKbps: e.target.value ? Number(e.target.value) : null })
          }
          aria-label="Audio bitrate"
        >
          <option value="">Source quality</option>
          {AUDIO_BITRATES.map((b) => (
            <option key={b} value={b}>
              {b} kbps
            </option>
          ))}
        </Select>
      </SettingRow>

      <ToggleRow
        label="Embed metadata"
        description="Write title, artist and date tags into the file."
        checked={settings.embedMetadata}
        onChange={(v) => update('audio', { embedMetadata: v })}
      />

      <ToggleRow
        label="Embed thumbnail"
        description="Use the thumbnail as cover art."
        checked={settings.embedThumbnail}
        onChange={(v) => update('audio', { embedThumbnail: v })}
      />
    </div>
  );
}

/** Subtitle download and embedding preferences. */
export function SubtitlesSection() {
  const settings = useSettingsStore((s) => s.settings.subtitles);
  const update = useSettingsStore((s) => s.updateSection);

  return (
    <div className="divide-y divide-border">
      <ToggleRow
        label="Download subtitles"
        description="Save subtitle files alongside the media."
        checked={settings.download}
        onChange={(v) => update('subtitles', { download: v })}
      />

      <ToggleRow
        label="Embed subtitles"
        description="Write subtitles into the media container."
        checked={settings.embed}
        onChange={(v) => update('subtitles', { embed: v })}
      />

      <ToggleRow
        label="Auto-generated captions"
        description="Include machine-generated captions when no human ones exist."
        checked={settings.includeAutoGenerated}
        onChange={(v) => update('subtitles', { includeAutoGenerated: v })}
      />

      <SettingRow
        label="Subtitle languages"
        description="Comma-separated codes. Empty means all available."
      >
        <Input
          value={settings.languages.join(', ')}
          onChange={(e) =>
            update('subtitles', {
              languages: e.target.value
                .split(',')
                .map((l) => l.trim())
                .filter(Boolean),
            })
          }
          placeholder="en, ca, es"
          aria-label="Subtitle languages"
        />
      </SettingRow>
    </div>
  );
}
