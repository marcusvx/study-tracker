import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './ThemeContext.1';

export type ThemeMode = 'system' | 'light' | 'dark';
type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';
const MEDIA_QUERY = '(prefers-color-scheme: light)';

function getSystemTheme(): Theme {
  return window.matchMedia?.(MEDIA_QUERY).matches ? 'light' : 'dark';
}

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
}

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);

  // Keeps the app in sync with OS-level theme changes (e.g. iOS/Android
  // scheduled dark mode) while `mode` is 'system'.
  useEffect(() => {
    const media = window.matchMedia(MEDIA_QUERY);
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'light' : 'dark');
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const theme: Theme = mode === 'system' ? systemTheme : mode;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo(
    () => ({ mode, theme, setThemeMode: setMode }),
    [mode, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
