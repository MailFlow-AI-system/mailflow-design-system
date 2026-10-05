import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, type MouseEvent as ReactMouseEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Badge } from '../src/components/Badge'

describe('Badge', () => {
  it('renders a span and forwards refs, native props, and events', async () => {
    const user = userEvent.setup()
    const ref = createRef<HTMLSpanElement>()
    const onClick = vi.fn()

    render(
      <Badge
        ref={ref}
        aria-label="Priority"
        data-testid="priority-badge"
        id="priority"
        onClick={onClick}
      >
        Important
      </Badge>,
    )

    const badge = screen.getByLabelText('Priority')
    await user.click(badge)

    expect(badge.tagName).toBe('SPAN')
    expect(ref.current).toBe(badge)
    expect(badge).toHaveAttribute('data-testid', 'priority-badge')
    expect(badge).toHaveAttribute('id', 'priority')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('composes an anchor and preserves both click handlers', async () => {
    const user = userEvent.setup()
    const onBadgeClick = vi.fn()
    const onLinkClick = vi.fn((event: ReactMouseEvent<HTMLAnchorElement>) => event.preventDefault())

    render(
      <Badge render={<a href="/inbox" onClick={onLinkClick} />} onClick={onBadgeClick}>
        Open inbox
      </Badge>,
    )

    const link = screen.getByRole('link', { name: 'Open inbox' })
    await user.click(link)

    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/inbox')
    expect(onBadgeClick).toHaveBeenCalledOnce()
    expect(onLinkClick).toHaveBeenCalledOnce()
  })
})
