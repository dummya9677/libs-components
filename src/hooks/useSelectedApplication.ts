import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nexaiq:selected-application';

function readStoredApplication(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

/**
 * Shared application selection across Home and Assistant.
 * Persists to sessionStorage so navigation keeps the same app context.
 */
export function useSelectedApplication() {
  const [applicationName, setApplicationNameState] = useState(readStoredApplication);

  useEffect(() => {
    try {
      if (applicationName) {
        sessionStorage.setItem(STORAGE_KEY, applicationName);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [applicationName]);

  const setApplicationName = useCallback((value: string) => {
    setApplicationNameState(value);
  }, []);

  const clearApplicationName = useCallback(() => {
    setApplicationNameState('');
  }, []);

  return {
    applicationName,
    hasApplication: Boolean(applicationName),
    setApplicationName,
    clearApplicationName,
  };
}
