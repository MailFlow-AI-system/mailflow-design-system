import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<Theme, 'system'>

export const THEME_STORAGE_KEY = 'mailflow-theme'

export type ThemeSnapshot = {
  theme: Theme
  resolvedTheme: ResolvedTheme
}

const defaultSnapshot: ThemeSnapshot = { theme: 'dark', resolvedTheme: 'dark' }
const listeners = new Set<() => void>()

let snapshot = defaultSnapshot
let initialized = false
let mediaQuery: MediaQueryList | undefined
let mediaListener: 'modern' | 'legacy' | undefined

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== 'system') return theme

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'dark'
  }
}

function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'dark'
  } catch {
    return 'dark'
  }
}

function writeStoredTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage can be blocked by browser privacy settings. The in-memory state still works.
  }
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.dataset.theme = resolvedTheme
  root.classList.toggle('dark', resolvedTheme === 'dark')
  root.style.colorScheme = resolvedTheme
}

function notify() {
  for (const listener of listeners) {
    listener()
  }
}

function updateSnapshot(theme: Theme, resolvedTheme = resolveTheme(theme)) {
  const nextSnapshot = { theme, resolvedTheme }
  if (
    nextSnapshot.theme === snapshot.theme &&
    nextSnapshot.resolvedTheme === snapshot.resolvedTheme
  ) {
    applyTheme(nextSnapshot.resolvedTheme)
    return
  }

  snapshot = nextSnapshot
  applyTheme(nextSnapshot.resolvedTheme)
  notify()
}

function removeMediaListener() {
  if (!mediaQuery) return

  if (mediaListener === 'modern') mediaQuery.removeEventListener?.('change', handleMediaChange)
  if (mediaListener === 'legacy') mediaQuery.removeListener?.(handleMediaChange)
  mediaQuery = undefined
  mediaListener = undefined
}

function syncMediaListener(theme: Theme) {
  removeMediaListener()
  if (theme !== 'system' || typeof window === 'undefined') return

  try {
    mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange)
      mediaListener = 'modern'
    } else if (mediaQuery?.addListener) {
      mediaQuery.addListener(handleMediaChange)
      mediaListener = 'legacy'
    }
  } catch {
    mediaQuery = undefined
  }
}

function handleMediaChange() {
  if (snapshot.theme === 'system') updateSnapshot('system')
}

function handleStorageChange(event: StorageEvent) {
  if (event.storageArea) {
    try {
      if (event.storageArea !== window.localStorage) return
    } catch {
      return
    }
  }

  if (event.key !== null && event.key !== THEME_STORAGE_KEY) return

  const nextTheme = event.key === null ? 'dark' : isTheme(event.newValue) ? event.newValue : 'dark'
  updateSnapshot(nextTheme)
  syncMediaListener(nextTheme)
}

export function initializeThemeStore() {
  if (initialized || typeof window === 'undefined') return

  initialized = true
  const theme = readStoredTheme()
  updateSnapshot(theme)
  syncMediaListener(theme)
  window.addEventListener('storage', handleStorageChange)
}

export function setTheme(theme: Theme) {
  if (!isTheme(theme)) return

  initializeThemeStore()
  writeStoredTheme(theme)
  updateSnapshot(theme)
  syncMediaListener(theme)
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener)
  initializeThemeStore()
  return () => listeners.delete(listener)
}

export function getThemeSnapshot() {
  return snapshot
}

export function getServerThemeSnapshot() {
  return defaultSnapshot
}

export function useThemeSnapshot() {
  return useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot)
}

export function __resetThemeStoreForTests() {
  removeMediaListener()
  if (typeof window !== 'undefined') window.removeEventListener('storage', handleStorageChange)
  snapshot = defaultSnapshot
  initialized = false
  listeners.clear()
}
