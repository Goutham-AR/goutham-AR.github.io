import { useState, useEffect, useCallback } from "react"

type Theme = "dark" | "light"

const STORAGE_KEY = "portfolio-theme"

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
      if (stored) return stored
      
      // Check system preference
      if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light"
      }
    }
    return "dark"
  })

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-theme", theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  return { theme, toggleTheme }
}
