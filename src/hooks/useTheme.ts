import { useState, useEffect } from 'react'

export default function useTheme() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const saved = localStorage.getItem('darkTheme')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(darkTheme ? 'dark' : 'light')
    localStorage.setItem('darkTheme', String(darkTheme))
  }, [darkTheme])

  return { darkTheme, setDarkTheme }
}
