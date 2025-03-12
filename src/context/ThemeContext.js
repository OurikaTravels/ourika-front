"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
})

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.add(savedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => { 
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  if (!mounted) {
    return null
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

