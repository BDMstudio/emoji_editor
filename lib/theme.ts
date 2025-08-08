// File: lib/theme.ts
'use client'

import { createContext, useContext } from 'react'

export type Theme = 'dark' | 'light'

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// AI-SUMMARY: Utility function to get initial theme from localStorage, system preference, or default to dark
export const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const stored = localStorage.getItem('emoji-editor-theme') as Theme
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
    
    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }
  }
  return 'dark'
}

// AI-SUMMARY: Utility function to persist theme to localStorage
export const setStoredTheme = (theme: Theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('emoji-editor-theme', theme)
  }
}