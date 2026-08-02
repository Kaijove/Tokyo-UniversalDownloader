import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { collapse } from '@/design-system/motion/motion';
import { ChevronDown, Settings2, ShieldAlert } from 'lucide-react';
import { Input, Select } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { useOptionsStore } from '../stores/options.store';
import { validateTemplate } from '../services/template-validator';
import {
  AUDIO_BITRATES,
  AUDIO_FORMATS,
  COOKIE_BROWSERS,
  VIDEO_CONTAINERS,
  DEFAULT_OUTPUT_TEMPLATE,
} from '../constants/defaults';
import type { AudioFormat, DownloadMode, VideoContainer } from '../types/options.types';

/** A labelled row inside the options panel. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs text-content-secondary">
      <span>{label}</span>
      <div className="w-48 shrink-0">{children}</div>
    </label>
  );
}

/** A checkbox row inside the options panel. */
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-content-secondary">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 accent-primary"
      />
      {label}
    </label>
  );
}

/**
 * Collapsible panel exposing the advanced download options. Collapsed by
 * default so the dashboard stays clean; every control writes straight to the
 * options store, which the queue reads when building yt-dlp arguments.
 */
export function AdvancedOptions() {
  const [open, setOpen] = useState(false);
  const defaults = useOptionsStore((s) => s.defaults);
  const setDefaults = useOptionsStore((s) => s.setDefaults);
  const [template, setTemplate] = useState(defaults.outputTemplate ?? '');

  const templateCheck = template ? validateTemplate(template) : { valid: true, error: null };

  const commitTemplate = (value: string) => {
    setTemplate(value);
    const check = value ? validateTemplate(value) : { valid: true, error: null };
    if (check.valid) setDefaults({ outputTemplate: value || null });
  };

  return (
    <section className="rounded-lg border border-border bg-surface">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-2.5 text-sm text-content-secondary transition-colors hover:text-content-primary"
      >
        <span className="flex items-center gap-2">
          <Settings2 size={16} /> Advanced options
        </span>
        <ChevronDown
          size={16}
          className={cn('transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            variants={collapse}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 border-t border-border px-3 py-3">
              <div className="flex flex-col gap-2">
                <Field label="Output">
                  <Select
                    value={defaults.mode}
                    onChange={(e) => setDefaults({ mode: e.target.value as DownloadMode })}
                    aria-label="Download mode"
                  >
                    <option value="video">Video</option>
                    <option value="audio">Audio only</option>
                  </Select>
                </Field>

                {defaults.mode === 'video' ? (
                  <Field label="Container">
                    <Select
                      value={defaults.videoContainer}
                      onChange={(e) =>
                        setDefaults({ videoContainer: e.target.value as VideoContainer })
                      }
                      aria-label="Video container"
                    >
                      {VIDEO_CONTAINERS.map((c) => (
                        <option key={c} value={c}>
                          {c.toUpperCase()}
                        </option>
                      ))}
                    </Select>
                  </Field>
                ) : (
                  <>
                    <Field label="Audio format">
                      <Select
                        value={defaults.audioFormat}
                        onChange={(e) =>
                          setDefaults({ audioFormat: e.target.value as AudioFormat })
                        }
                        aria-label="Audio format"
                      >
                        {AUDIO_FORMATS.map((f) => (
                          <option key={f} value={f}>
                            {f.toUpperCase()}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Bitrate">
                      <Select
                        value={defaults.audioBitrateKbps ?? ''}
                        onChange={(e) =>
                          setDefaults({
                            audioBitrateKbps: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        aria-label="Audio bitrate"
                      >
                        <option value="">Source</option>
                        {AUDIO_BITRATES.map((b) => (
                          <option key={b} value={b}>
                            {b} kbps
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3">
                <Toggle
                  label="Embed metadata"
                  checked={defaults.embedMetadata}
                  onChange={(v) => setDefaults({ embedMetadata: v })}
                />
                <Toggle
                  label="Embed thumbnail"
                  checked={defaults.embedThumbnail}
                  onChange={(v) => setDefaults({ embedThumbnail: v })}
                />
                <Toggle
                  label="Save thumbnail"
                  checked={defaults.downloadThumbnail}
                  onChange={(v) => setDefaults({ downloadThumbnail: v })}
                />
                <Toggle
                  label="Download subtitles"
                  checked={defaults.subtitles.download}
                  onChange={(v) =>
                    setDefaults({ subtitles: { ...defaults.subtitles, download: v } })
                  }
                />
                <Toggle
                  label="Embed subtitles"
                  checked={defaults.subtitles.embed}
                  onChange={(v) =>
                    setDefaults({ subtitles: { ...defaults.subtitles, embed: v } })
                  }
                />
                <Toggle
                  label="Auto captions"
                  checked={defaults.subtitles.includeAutoGenerated}
                  onChange={(v) =>
                    setDefaults({
                      subtitles: { ...defaults.subtitles, includeAutoGenerated: v },
                    })
                  }
                />
                <Toggle
                  label="Download playlists"
                  checked={defaults.playlist.enabled}
                  onChange={(v) =>
                    setDefaults({ playlist: { ...defaults.playlist, enabled: v } })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <Field label="Simultaneous downloads">
                  <Select
                    value={defaults.maxConcurrent}
                    onChange={(e) => setDefaults({ maxConcurrent: Number(e.target.value) })}
                    aria-label="Simultaneous downloads"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Speed limit">
                  <Input
                    value={defaults.rateLimit ?? ''}
                    onChange={(e) => setDefaults({ rateLimit: e.target.value || null })}
                    placeholder="e.g. 2M"
                    aria-label="Speed limit"
                  />
                </Field>
                <Field label="Max retries">
                  <Select
                    value={defaults.retry.maxAttempts}
                    onChange={(e) =>
                      setDefaults({
                        retry: { ...defaults.retry, maxAttempts: Number(e.target.value) },
                      })
                    }
                    aria-label="Max retries"
                  >
                    {[0, 1, 2, 3, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <Input
                  value={template}
                  onChange={(e) => commitTemplate(e.target.value)}
                  onClear={() => commitTemplate('')}
                  placeholder={DEFAULT_OUTPUT_TEMPLATE}
                  aria-label="Filename template"
                  error={templateCheck.error ?? undefined}
                />
                <p className="text-xs text-content-tertiary">
                  Filename template. Leave empty for the default.
                </p>
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <Field label="Cookies from browser">
                  <Select
                    value={defaults.cookies.fromBrowser ?? ''}
                    onChange={(e) =>
                      setDefaults({
                        cookies: {
                          ...defaults.cookies,
                          fromBrowser: e.target.value || null,
                        },
                      })
                    }
                    aria-label="Cookies from browser"
                  >
                    <option value="">None</option>
                    {COOKIE_BROWSERS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Select>
                </Field>
                {defaults.cookies.fromBrowser && (
                  <p className="flex items-start gap-2 rounded-md bg-warning/10 px-2 py-2 text-xs text-warning">
                    <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                    Sharing browser cookies gives the downloader access to your logged-in
                    sessions. Only use this for content you can already access.
                  </p>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
