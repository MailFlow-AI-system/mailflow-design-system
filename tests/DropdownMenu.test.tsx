import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@mailflow/ui/components'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('DropdownMenu', () => {
  it('opens and selects an item', async () => {
    const onSelect = vi.fn()

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Choose theme</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onSelect}>Light</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Choose theme' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Light' }))

    expect(onSelect).toHaveBeenCalledOnce()
  })
})
