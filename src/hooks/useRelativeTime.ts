import { useEffect, useState } from 'react';
import { formatRelativeTime } from '../utils/time';

/**
 * Returns a relative time label that refreshes periodically (e.g. "Just now" → "2 mins ago").
 */
export function useRelativeTime(
  input: Date | string | number | undefined,
): string {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 30_000);

    return () => window.clearInterval(id);
  }, []);

  if (!input) return '';
  return formatRelativeTime(input);
}
