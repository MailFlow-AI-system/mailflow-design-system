import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@mailflow/ui/components'
import { Archive } from '@mailflow/ui/icons'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

describe('Empty', () => {
  it('renders a decorative icon, a consumer-chosen heading, a description and an action', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(
      <Empty data-testid="empty">
        <EmptyHeader>
          <EmptyMedia>
            <Archive />
          </EmptyMedia>
          <EmptyTitle render={(props) => <h2 {...props} />}>No archived messages</EmptyTitle>
          <EmptyDescription>Archived messages appear here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={onAction}>Go to Inbox</Button>
        </EmptyContent>
      </Empty>,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'No archived messages' })).toBeVisible()
    expect(screen.getByText('Archived messages appear here.').tagName).toBe('P')
    const media = screen.getByTestId('empty').querySelector('[data-slot="empty-media"]')
    expect(media).toHaveAttribute('aria-hidden', 'true')
    await user.click(screen.getByRole('button', { name: 'Go to Inbox' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('uses neutral elements by default and merges consumer classes', () => {
    render(
      <Empty className="min-h-40" data-testid="empty">
        <EmptyTitle>No results</EmptyTitle>
      </Empty>,
    )
    const empty = screen.getByTestId('empty')
    expect(empty.tagName).toBe('DIV')
    expect(empty).toHaveAttribute('data-slot', 'empty')
    expect(empty).toHaveClass('min-h-40')
    expect(screen.getByText('No results').tagName).toBe('DIV')
  })
})
