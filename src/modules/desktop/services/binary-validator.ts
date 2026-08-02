/** Result of checking a user-supplied executable path. */
export interface BinaryValidation {
  valid: boolean;
  error: string | null;
}

/** Characters that have no business in an executable path. */
const SHELL_METACHARACTERS = /[;&|`$(){}<>\n\r]/;

/**
 * Validates a custom binary path before it reaches the backend.
 *
 * An empty value is valid and means "use the one on PATH". Anything else must
 * be an absolute path with no parent-directory segments and no shell
 * metacharacters — the latter matters because the path is handed to a process
 * spawner, and a value like `yt-dlp; rm -rf ~` must never be accepted.
 *
 * This mirrors the checks the Rust side performs; both exist on purpose, since
 * the frontend gives immediate feedback while the backend is the real
 * boundary.
 */
export function validateBinaryPath(path: string): BinaryValidation {
  const trimmed = path.trim();

  if (!trimmed) {
    return { valid: true, error: null };
  }

  if (SHELL_METACHARACTERS.test(trimmed)) {
    return { valid: false, error: 'Path contains characters that are not allowed.' };
  }

  const isAbsolute = trimmed.startsWith('/') || /^[a-zA-Z]:[\\/]/.test(trimmed);
  if (!isAbsolute) {
    return { valid: false, error: 'Enter an absolute path, or leave empty to use PATH.' };
  }

  if (trimmed.split(/[\\/]/).includes('..')) {
    return { valid: false, error: "Path must not contain '..'." };
  }

  return { valid: true, error: null };
}
