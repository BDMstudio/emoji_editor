// File: components/ThemeProvider.tsx
'use client'

import { useEffect, useState } from 'react'
import { ThemeContext, Theme, getInitialTheme, setStoredTheme } from '@/lib/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}

// AI-SUMMARY: Provider component that manages theme state and provides theme context to the application
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    setMounted(true)
    
    // Apply theme class to document
    document.documentElement.className = initialTheme
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    setStoredTheme(newTheme)
    document.documentElement.className = newTheme
  }

  // Prevent hydration mismatch by not rendering children until mounted
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}