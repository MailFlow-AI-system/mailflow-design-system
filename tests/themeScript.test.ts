import { beforeEach, describe, expect, it, vi } from 'vitest'
import { themeScript } from '../src/theme/themeScript'
import { THEME_STORAGE_KEY } from '../src/theme/themeStore'

function runThemeScript() {
  Function(themeScript)()
}

describe('themeScript', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = ''
    document.head.innerHTML = ''
  })

  it('applies a persisted light preference synchronously', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    runThemeScript()

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('defaults to dark when the preference is missing', () => {
    runThemeScript()

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('defaults to dark when the persisted preference is invalid', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'sepia')
    runThemeScript()

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('defaults to dark when localStorage is blocked', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => {
        throw new Error('blocked')
      },
    })

    try {
      runThemeScript()
      expect(document.documentElement.dataset.theme).toBe('dark')
      expect(document.documentElement.style.colorScheme).toBe('dark')
    } finally {
      if (descriptor) Object.defineProperty(window, 'localStorage', descriptor)
    }
  })

  it.each([
    { matches: true, expected: 'dark' },
    { matches: false, expected: 'light' },
  ])('resolves system to the active OS palette ($expected)', ({ matches, expected }) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'system')
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({ matches })),
    })

    try {
      runThemeScript()
      expect(document.documentElement.dataset.theme).toBe(expected)
      expect(document.documentElement.style.colorScheme).toBe(expected)
    } finally {
      if (originalMatchMedia) {
        Object.defineProperty(window, 'matchMedia', {
          configurable: true,
          value: originalMatchMedia,
        })
      } else {
        Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined })
      }
    }
  })

  it('resolves system safely when matchMedia is unavailable or throws', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'system')
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => {
        throw new Error('unavailable')
      }),
    })

    try {
      runThemeScript()
      expect(document.documentElement.dataset.theme).toBe('dark')
      expect(document.documentElement.style.colorScheme).toBe('dark')
    } finally {
      if (originalMatchMedia) {
        Object.defineProperty(window, 'matchMedia', {
          configurable: true,
          value: originalMatchMedia,
        })
      } else {
        Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined })
      }
    }
  })
})
