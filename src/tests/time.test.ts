import { describe, it, expect } from 'vitest';
import { formatRelativeTime, parseApiTimestamp } from '../utils/time';

describe('parseApiTimestamp', () => {
  it('treats naive backend datetimes as UTC', () => {
    const parsed = parseApiTimestamp('2026-08-05T09:55:27.920409');
    expect(parsed.toISOString()).toBe('2026-08-05T09:55:27.920Z');
  });
});

describe('formatRelativeTime', () => {
  it('formats minutes and hours', () => {
    expect(formatRelativeTime(Date.now() - 5 * 60_000)).toBe('5 mins ago');
    expect(formatRelativeTime(Date.now() - 60_000)).toBe('1 min ago');
    expect(formatRelativeTime(Date.now() - 2 * 60 * 60_000)).toBe('2 hours ago');
  });
});
