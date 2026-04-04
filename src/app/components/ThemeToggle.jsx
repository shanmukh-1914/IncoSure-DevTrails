import { Moon, Sun } from "lucide-react";
import { useDarkModeContext } from "../hooks/useDarkMode.jsx";

export function ThemeToggle() {
  const { isDark, toggle } = useDarkModeContext();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 rounded-full border border-gray-700 bg-gray-900/85 px-3 py-2 text-white shadow-lg backdrop-blur hover:bg-gray-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      <span className="flex items-center gap-2 text-xs font-semibold">
        {isDark ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} className="text-blue-300" />}
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
