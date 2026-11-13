import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@mailflow/ui/components'
import { Archive } from '@mailflow/ui/icons'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

function ArchiveAction({ onClick }: { onClick?: () => void }) {
  return (
    <TooltipProvider delay={0} closeDelay={0}>
      <Tooltip>
        <TooltipTrigger
          render={<Button aria-label="Archive" size="icon" variant="ghost" onClick={onClick} />}
        >
          <Archive aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>Archive</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

describe('Tooltip', () => {
  it('shows its label on hover and hides it when the pointer leaves', async () => {
    const user = userEvent.setup()
    render(<ArchiveAction />)
    const trigger = screen.getByRole('button', { name: 'Archive' })
    expect(screen.queryByText('Archive', { selector: '[data-slot="tooltip-content"]' })).toBeNull()

    await user.hover(trigger)
    const content = await screen.findByText('Archive', {
      selector: '[data-slot="tooltip-content"]',
    })
    expect(content).toBeVisible()

    await user.unhover(trigger)
    await waitFor(() =>
      expect(
        screen.queryByText('Archive', { selector: '[data-slot="tooltip-content"]' }),
      ).toBeNull(),
    )
  })

  it('opens on keyboard focus, closes on Escape and keeps the trigger name and action', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ArchiveAction onClick={onClick} />)
    const trigger = screen.getByRole('button', { name: 'Archive' })

    await user.tab()
    expect(trigger).toHaveFocus()
    await screen.findByText('Archive', { selector: '[data-slot="tooltip-content"]' })

    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        screen.queryByText('Archive', { selector: '[data-slot="tooltip-content"]' }),
      ).toBeNull(),
    )
    expect(trigger).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledOnce()
    expect(trigger).toHaveAttribute('data-slot', 'tooltip-trigger')
  })

  it('stays closed when disabled', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider delay={0}>
        <Tooltip disabled>
          <TooltipTrigger render={<Button aria-label="Star" size="icon" />} />
          <TooltipContent>Star</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    await user.hover(screen.getByRole('button', { name: 'Star' }))
    expect(screen.queryByText('Star', { selector: '[data-slot="tooltip-content"]' })).toBeNull()
  })
})
