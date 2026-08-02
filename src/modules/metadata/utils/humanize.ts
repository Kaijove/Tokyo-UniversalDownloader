/** Formats a byte count as a compact human string (e.g. "12.4 MB"). */
export function humanBytes(bytes: number | null): string | null {
  if (bytes === null || !Number.isFinite(bytes) || bytes <= 0) return null;
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 100 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

/** Formats a view/like count compactly (e.g. "1.2M", "34K"). */
export function humanCount(count: number | null): string | null {
  if (count === null || count < 0) return null;
  if (count < 1000) return String(count);
  const units = [
    { limit: 1_000_000_000, suffix: 'B' },
    { limit: 1_000_000, suffix: 'M' },
    { limit: 1_000, suffix: 'K' },
  ];
  for (const { limit, suffix } of units) {
    if (count >= limit) {
      const value = count / limit;
      return `${value.toFixed(value >= 100 ? 0 : 1)}${suffix}`;
    }
  }
  return String(count);
}

/** Formats a duration in seconds as H:MM:SS or M:SS. */
export function humanDuration(seconds: number | null): string | null {
  if (seconds === null || seconds < 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Converts a yt-dlp upload date (YYYYMMDD) to a locale date string. */
export function humanDate(raw: string | null): string | null {
  if (!raw || raw.length !== 8) return null;
  const year = Number(raw.slice(0, 4));
  const month = Number(raw.slice(4, 6));
  const day = Number(raw.slice(6, 8));
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
}
