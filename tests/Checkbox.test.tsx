import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from '../src/components/Checkbox'

describe('Checkbox', () => {
  it('forwards its ref, native props, and merges className', () => {
    const ref = createRef<HTMLElement>()

    render(
      <Checkbox
        ref={ref}
        aria-label="Select message"
        className="custom-checkbox"
        data-testid="checkbox"
      />,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Select message' })
    expect(ref.current).toBe(checkbox)
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox')
    expect(checkbox).toHaveAttribute('data-testid', 'checkbox')
    expect(checkbox).toHaveClass('custom-checkbox', 'border-primary')
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles with a pointer click and the Space key, reporting each change', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(<Checkbox aria-label="Select message" onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Select message' })
    await user.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything())

    checkbox.focus()
    await user.keyboard(' ')
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    expect(onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything())
    expect(onCheckedChange).toHaveBeenCalledTimes(2)
  })

  it('follows a controlled value and only changes when the consumer updates it', async () => {
    const user = userEvent.setup()

    function Controlled({ locked }: { locked: boolean }) {
      const [checked, setChecked] = useState(false)
      return (
        <Checkbox
          aria-label="Select message"
          checked={checked}
          onCheckedChange={(next) => {
            if (!locked) setChecked(next)
          }}
        />
      )
    }

    const { rerender } = render(<Controlled locked />)
    const checkbox = screen.getByRole('checkbox', { name: 'Select message' })
    await user.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'false')

    rerender(<Controlled locked={false} />)
    await user.click(screen.getByRole('checkbox', { name: 'Select message' }))
    expect(screen.getByRole('checkbox', { name: 'Select message' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('exposes the mixed state for partial selections and shows the dash indicator', () => {
    const { container } = render(<Checkbox aria-label="Select all" indeterminate />)

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' })
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    expect(checkbox).toHaveAttribute('data-indeterminate')
    expect(checkbox).toHaveClass('data-[indeterminate]:bg-primary')
    const icons = container.querySelectorAll('svg[aria-hidden="true"]')
    expect(icons).toHaveLength(2)
    expect(icons[0]).toHaveClass('group-data-[indeterminate]:hidden')
    expect(icons[1]).toHaveClass('group-data-[indeterminate]:block')
  })

  it('moves from mixed to checked when activated', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(<Checkbox aria-label="Select all" indeterminate onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox', { name: 'Select all' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('ignores interaction while disabled and marks the disabled state', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(<Checkbox aria-label="Select message" disabled onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Select message' })
    await user.click(checkbox)
    expect(onCheckedChange).not.toHaveBeenCalled()
    expect(checkbox).toHaveAttribute('data-disabled')
    expect(checkbox).toHaveAttribute('aria-disabled', 'true')
  })

  it('accepts a state-aware className and a native label association', async () => {
    const user = userEvent.setup()

    render(
      <>
        <Checkbox
          id="remember-me"
          className={({ checked }) => (checked ? 'is-checked' : 'is-unchecked')}
        />
        <label htmlFor="remember-me">Remember me</label>
      </>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Remember me' })
    expect(checkbox).toHaveClass('is-unchecked')
    await user.click(screen.getByText('Remember me'))
    expect(checkbox).toHaveClass('is-checked')
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })
})
