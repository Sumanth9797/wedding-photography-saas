import { useState, useEffect } from 'react'

export const THEME_ORDER = ['system', 'light', 'dark']

// Returns [theme, setTheme]
// theme: 'system' | 'light' | 'dark'
export function useDarkMode() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system'
  })

  const [systemDark, setSystemDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Listen for OS-level preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && systemDark)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    if (theme === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', theme)
    }
  }, [isDark, theme])

  return [theme, setTheme]
}

export default useDarkMode
