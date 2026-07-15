import { describe, it, expect } from 'vitest';
import { formatRelativeTime } from '../utils/time';

describe('formatRelativeTime', () => {
  it('formats minutes and hours', () => {
    expect(formatRelativeTime(Date.now() - 5 * 60_000)).toBe('5 mins ago');
    expect(formatRelativeTime(Date.now() - 60_000)).toBe('1 min ago');
    expect(formatRelativeTime(Date.now() - 2 * 60 * 60_000)).toBe('2 hours ago');
  });
});
