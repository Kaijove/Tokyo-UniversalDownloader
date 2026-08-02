/** Result of validating an output template. */
export interface TemplateValidation {
  valid: boolean;
  /** Human-readable reason when invalid. */
  error: string | null;
}

/** Fields yt-dlp understands that we surface as safe to use. */
export const KNOWN_TEMPLATE_FIELDS = [
  'title',
  'ext',
  'uploader',
  'channel',
  'upload_date',
  'id',
  'playlist',
  'playlist_index',
  'resolution',
  'duration',
] as const;

/** Characters that are invalid in filenames on at least one major OS. */
// Control characters (0x00-0x1f) are genuinely illegal in filenames, so
// matching them here is intentional.
// eslint-disable-next-line no-control-regex
const ILLEGAL_CHARS = /[<>:"|?*\u0000-\u001f]/;

const FIELD_PATTERN = /%\(([a-z_]+)\)([sdj])/g;

/**
 * Validates a yt-dlp output template. Rejects path traversal, absolute paths,
 * illegal filename characters, unknown field names and templates missing an
 * extension placeholder (which would produce extension-less files).
 *
 * Pure — safe to call on every keystroke.
 */
export function validateTemplate(template: string): TemplateValidation {
  const trimmed = template.trim();

  if (!trimmed) {
    return { valid: false, error: 'Template cannot be empty.' };
  }
  if (trimmed.startsWith('/') || /^[a-zA-Z]:/.test(trimmed)) {
    return { valid: false, error: 'Template must be a relative path.' };
  }
  if (trimmed.split('/').includes('..')) {
    return { valid: false, error: "Template must not contain '..'." };
  }

  // Strip the field placeholders before checking for illegal characters, so
  // the '%(' and ')s' syntax itself doesn't trip the check.
  const withoutFields = trimmed.replace(FIELD_PATTERN, '');
  if (ILLEGAL_CHARS.test(withoutFields)) {
    return { valid: false, error: 'Template contains invalid filename characters.' };
  }

  const fields = [...trimmed.matchAll(FIELD_PATTERN)].map((m) => m[1]);
  const unknown = fields.find(
    (field) => !KNOWN_TEMPLATE_FIELDS.includes(field as (typeof KNOWN_TEMPLATE_FIELDS)[number]),
  );
  if (unknown) {
    return { valid: false, error: `Unknown field: %(${unknown})s` };
  }

  if (!fields.includes('ext')) {
    return { valid: false, error: 'Template must include %(ext)s.' };
  }

  return { valid: true, error: null };
}
