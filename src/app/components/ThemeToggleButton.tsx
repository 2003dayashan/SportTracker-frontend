import { useEsportTheme } from "../context/EsportThemeContext";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useEsportTheme();
  return (
    <button
      onClick={toggleTheme}
      title={theme === "light" ? "Switch to Stick League Pro (Dark)" : "Switch to Light Mode"}
      className="flex items-center justify-center w-11 h-11 rounded-full border-2
                 border-[#2b2b2b] dark:border-[#e6394a]
                 bg-[#efe9da]/70 dark:bg-[#1f1b18]
                 text-[#2b2b2b] dark:text-[#f3eee1]
                 transition-colors"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}