import { Input } from '@mailflow/ui/components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('Input', () => {
  it('keeps native label and typing behavior', async () => {
    const user = userEvent.setup()

    render(
      <>
        <label htmlFor="email">Email address</label>
        <Input id="email" type="email" aria-invalid="true" />
      </>,
    )

    const input = screen.getByRole('textbox', { name: 'Email address' })
    await user.type(input, 'person@example.com')

    expect(input).toHaveValue('person@example.com')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('data-slot', 'input')
  })

  it('does not accept typing while disabled', async () => {
    const user = userEvent.setup()

    render(
      <>
        <label htmlFor="disabled-email">Email address</label>
        <Input id="disabled-email" disabled />
      </>,
    )

    const input = screen.getByRole('textbox', { name: 'Email address' })
    await user.type(input, 'person@example.com')

    expect(input).toBeDisabled()
    expect(input).toHaveValue('')
  })
})
