import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../src/components/Button'
import { Label } from '../src/components/Label'

describe('Button', () => {
  it('handles clicks and preserves the disabled boundary', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <>
        <Button onClick={onClick}>Send</Button>
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      </>,
    )

    await user.click(screen.getByRole('button', { name: 'Send' }))
    await user.click(screen.getByRole('button', { name: 'Disabled' }))

    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled()
  })

  it('composes an anchor through Base UI render composition', () => {
    render(
      <Button render={<a href="/inbox" />} nativeButton={false} variant="outline" size="lg">
        Inbox
      </Button>,
    )

    const link = screen.getByRole('button', { name: 'Inbox' })
    expect(link).toHaveAttribute('href', '/inbox')
    expect(link.tagName).toBe('A')
    expect(link).toHaveClass('border-input', 'h-10')
  })
})

describe('Label', () => {
  it('renders a native label with its association intact', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    )

    expect(screen.getByText('Email').tagName).toBe('LABEL')
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email')
  })
})
