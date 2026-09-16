import { act, waitFor } from '@testing-library/react'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider'
import { __resetThemeStoreForTests, THEME_STORAGE_KEY } from '../src/theme/themeStore'

function HydrationProbe() {
  const { theme, resolvedTheme } = useTheme()
  return (
    <output data-testid="hydration-theme">
      {theme}:{resolvedTheme}
    </output>
  )
}

describe('ThemeProvider hydration', () => {
  beforeEach(() => {
    __resetThemeStoreForTests()
    window.localStorage.clear()
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  it('keeps the deterministic dark server snapshot and applies persisted light after hydration', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    const element = (
      <StrictMode>
        <ThemeProvider>
          <HydrationProbe />
        </ThemeProvider>
      </StrictMode>
    )
    const html = renderToString(element)
    expect(html).toContain('dark')

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined

    await act(async () => {
      root = hydrateRoot(container, element, { onRecoverableError })
    })
    await waitFor(() => expect(container).toHaveTextContent('light:light'))

    expect(onRecoverableError).not.toHaveBeenCalled()
    await act(async () => root?.unmount())
  })
})
