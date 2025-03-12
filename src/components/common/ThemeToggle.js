"use client"
import { useTheme } from "../../context/ThemeContext"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors ${
        theme === "dark"
          ? "bg-gray-800 text-yellow-500 hover:bg-gray-700"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
