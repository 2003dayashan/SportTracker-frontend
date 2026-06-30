import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type EsportTheme = "light" | "dark";

interface EsportThemeContextValue {
  theme: EsportTheme;
  toggleTheme: () => void;
}

const EsportThemeContext = createContext<EsportThemeContextValue | undefined>(undefined);

export function EsportThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<EsportTheme>(() => {
    return (localStorage.getItem("esport-theme") as EsportTheme) || "light";
  });

  useEffect(() => {
    localStorage.setItem("esport-theme", theme);
  }, [theme]);

  // Sync the .esport-dark class onto the #esport-root wrapper element
  // so Tailwind's `esport-dark:` variant (defined via @custom-variant
  // in the CSS) actually activates — without touching shadcn's own
  // global `.dark` class.
  useEffect(() => {
    const esportRoot = document.getElementById("esport-root");
    if (esportRoot) {
      esportRoot.classList.toggle("esport-dark", theme === "dark");
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <EsportThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </EsportThemeContext.Provider>
  );
}

export function useEsportTheme() {
  const ctx = useContext(EsportThemeContext);
  if (!ctx) throw new Error("useEsportTheme must be used within EsportThemeProvider");
  return ctx;
}