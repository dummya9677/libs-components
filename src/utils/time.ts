/**
 * Parses backend timestamps. Python often returns naive UTC ISO strings without `Z`
 * (e.g. "2026-08-05T09:55:27.920409"). Without a timezone, JS treats those as local
 * time and relative labels appear hours off for non-UTC users.
 */
export function parseApiTimestamp(input: Date | string | number): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);

  const trimmed = input.trim();
  if (!trimmed) return new Date(Number.NaN);

  if (/[zZ]$/.test(trimmed) || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    return new Date(trimmed);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00Z`);
  }

  return new Date(`${trimmed}Z`);
}

/** Normalizes API timestamps to UTC ISO strings for storage and sorting. */
export function normalizeApiTimestamp(input: Date | string | number): string {
  const date = parseApiTimestamp(input);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

/**
 * Formats a date as a short relative time label (e.g. "Just now", "5 mins ago").
 */
export function formatRelativeTime(input: Date | string | number): string {
  const date = parseApiTimestamp(input);
  if (Number.isNaN(date.getTime())) return '';

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 45) return 'Just now';
  if (seconds < 90) return '1 min ago';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

/** Convenience for demo/seed data: ISO timestamp N minutes in the past */
export function minutesAgoIso(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}
