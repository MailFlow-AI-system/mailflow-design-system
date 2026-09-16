import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider'
import { __resetThemeStoreForTests, THEME_STORAGE_KEY } from '../src/theme/themeStore'

function ThemeProbe() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  return (
    <>
      <output data-testid="theme">
        {theme}:{resolvedTheme}
      </output>
      <button type="button" onClick={() => setTheme('light')}>
        Set light
      </button>
      <button type="button" onClick={() => setTheme('system')}>
        Set system
      </button>
    </>
  )
}

function ResolvedThemeProbe() {
  return <output data-testid="second">{useTheme().resolvedTheme}</output>
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    __resetThemeStoreForTests()
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = ''
    vi.restoreAllMocks()
  })

  it('starts with the dark default without reading browser globals during render', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark:dark')
  })

  it('uses valid persisted preferences and falls back for invalid values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    const { unmount } = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light:light')
    unmount()
    __resetThemeStoreForTests()
    window.localStorage.setItem(THEME_STORAGE_KEY, 'sepia')

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark:dark')
  })

  it('continues in memory when storage is blocked', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => {
        throw new Error('blocked')
      },
    })

    try {
      render(
        <ThemeProvider>
          <ThemeProbe />
        </ThemeProvider>,
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('dark:dark')
      fireEvent.click(screen.getByRole('button', { name: 'Set light' }))
      expect(screen.getByTestId('theme')).toHaveTextContent('light:light')
    } finally {
      if (descriptor) Object.defineProperty(window, 'localStorage', descriptor)
    }
  })

  it('falls back to dark for system when OS detection is unavailable', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'system')

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('system:dark')
  })

  it('follows OS changes only while the system preference is active', () => {
    let matches = false
    const changeListeners = new Set<(event: MediaQueryListEvent) => void>()
    const mediaQuery = {
      matches,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
        changeListeners.add(listener)
      }),
      removeEventListener: vi.fn(
        (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          changeListeners.delete(listener)
        },
      ),
    } as unknown as MediaQueryList
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => mediaQuery),
    })

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'system')

      render(
        <ThemeProvider>
          <ThemeProbe />
        </ThemeProvider>,
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('system:light')
      matches = true
      Object.defineProperty(mediaQuery, 'matches', { configurable: true, value: matches })
      act(() => {
        changeListeners.forEach((listener) => {
          listener({ matches } as MediaQueryListEvent)
        })
      })
      expect(screen.getByTestId('theme')).toHaveTextContent('system:dark')

      fireEvent.click(screen.getByRole('button', { name: 'Set light' }))
      expect(mediaQuery.removeEventListener).toHaveBeenCalled()
      matches = false
      Object.defineProperty(mediaQuery, 'matches', { configurable: true, value: matches })
      act(() => {
        changeListeners.forEach((listener) => {
          listener({ matches } as MediaQueryListEvent)
        })
      })
      expect(screen.getByTestId('theme')).toHaveTextContent('light:light')
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

  it('shares updates between independent providers and storage events', () => {
    render(
      <>
        <ThemeProvider>
          <ThemeProbe />
        </ThemeProvider>
        <ThemeProvider>
          <ResolvedThemeProbe />
        </ThemeProvider>
      </>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Set light' }))
    expect(screen.getAllByTestId('theme')[0]).toHaveTextContent('light:light')
    expect(screen.getByTestId('second')).toHaveTextContent('light')

    fireEvent(window, new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: 'dark' }))
    expect(screen.getAllByTestId('theme')[0]).toHaveTextContent('dark:dark')
    fireEvent(window, new StorageEvent('storage', { key: null, newValue: null }))
    expect(screen.getAllByTestId('theme')[0]).toHaveTextContent('dark:dark')
  })

  it('ignores session storage events', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    fireEvent(
      window,
      new StorageEvent('storage', {
        key: THEME_STORAGE_KEY,
        newValue: 'light',
        storageArea: window.sessionStorage,
      }),
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark:dark')
  })
})
