// src/pages/esport/EsportThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

export type EsportTheme = 'dark' | 'light';

interface EsportThemeContextValue {
  theme: EsportTheme;
  toggleTheme: () => void;
}

const EsportThemeContext = createContext<EsportThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'esport-theme';

export const EsportThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<EsportTheme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <EsportThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* This wrapper's class drives every CSS variable in theme.css.
          Only descendants of this div are themeable — rest of the app untouched. */}
      <div className={`esport-root theme-${theme}`}>{children}</div>
    </EsportThemeContext.Provider>
  );
};

export const useEsportTheme = (): EsportThemeContextValue => {
  const ctx = useContext(EsportThemeContext);
  if (!ctx) throw new Error('useEsportTheme must be used inside <EsportThemeProvider>');
  return ctx;
};

