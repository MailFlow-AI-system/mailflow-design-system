import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { setTheme, type Theme, type ThemeSnapshot, useThemeSnapshot } from './themeStore'

type ThemeContextValue = ThemeSnapshot & { setTheme: (theme: Theme) => void }

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useThemeSnapshot()

  const value = useMemo(() => ({ ...snapshot, setTheme }), [snapshot])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

export type { Theme, ThemeSnapshot }
