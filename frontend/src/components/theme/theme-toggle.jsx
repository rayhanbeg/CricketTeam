

import { useTheme } from "./theme-provider"
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md ${
          theme === "light" ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground hover:bg-secondary"
        }`}
        title="Light mode"
      >
        <FaSun className="h-4 w-4" />
        <span className="sr-only">Light mode</span>
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md ${
          theme === "dark" ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground hover:bg-secondary"
        }`}
        title="Dark mode"
      >
        <FaMoon className="h-4 w-4" />
        <span className="sr-only">Dark mode</span>
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md ${
          theme === "system"
            ? "bg-primary text-primary-foreground"
            : "bg-transparent text-foreground hover:bg-secondary"
        }`}
        title="System preference"
      >
        <FaDesktop className="h-4 w-4" />
        <span className="sr-only">System preference</span>
      </button>
    </div>
  )
}
