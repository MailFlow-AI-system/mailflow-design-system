import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mailflow/ui/components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

describe('Select', () => {
  it('opens and selects an option', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <Select defaultValue="inbox" onValueChange={onValueChange}>
        <SelectTrigger aria-label="Mailbox">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inbox">Inbox</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
        </SelectContent>
      </Select>,
    )

    const trigger = screen.getByRole('combobox', { name: 'Mailbox' })
    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: 'Sent' }))

    expect(onValueChange).toHaveBeenCalledWith('sent', expect.anything())
  })

  it('supports keyboard navigation and selection', async () => {
    const user = userEvent.setup()

    render(
      <Select>
        <SelectTrigger aria-label="Mailbox">
          <SelectValue placeholder="Select a mailbox" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inbox">Inbox</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
        </SelectContent>
      </Select>,
    )

    const trigger = screen.getByRole('combobox', { name: 'Mailbox' })
    await user.click(trigger)
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('option', { name: 'Inbox' })).toHaveAttribute('data-highlighted')
  })
})
