"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "./Icon";

type Theme = "dark" | "light";

/**
 * Light is the default. The chosen theme is stored in localStorage and applied by the inline
 * script in app/layout.tsx before first paint, so there is no flash. Both icons render and CSS
 * shows the right one, so the icon is correct even before hydration.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage unavailable (private mode) — the switch still applies for this visit
    }
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-switching"), 400);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <Sun className="theme-icon theme-icon-sun" />
      <Moon className="theme-icon theme-icon-moon" />
    </button>
  );
}
