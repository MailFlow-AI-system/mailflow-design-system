import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@mailflow/ui/components'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Sheet', () => {
  it('opens from its trigger and closes with Escape', async () => {
    render(
      <Sheet>
        <SheetTrigger>Open navigation</SheetTrigger>
        <SheetContent>
          <SheetTitle>Navigation</SheetTitle>
          <p>Menu links</p>
        </SheetContent>
      </Sheet>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    expect(screen.getByRole('heading', { name: 'Navigation' })).toBeVisible()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('heading', { name: 'Navigation' })).not.toBeInTheDocument()
  })

  it('supports the sidebar variant without changing the default sheet contract', () => {
    render(
      <Sheet>
        <SheetTrigger>Open sidebar</SheetTrigger>
        <SheetContent variant="sidebar" side="left">
          <SheetTitle>Application navigation</SheetTitle>
        </SheetContent>
      </Sheet>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }))

    const content = screen.getByRole('dialog')
    expect(content).toHaveAttribute('data-variant', 'sidebar')
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeVisible()
  })
})
