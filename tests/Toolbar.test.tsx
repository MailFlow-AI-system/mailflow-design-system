import { Toolbar, ToolbarButton, ToolbarSeparator } from '@mailflow/ui/components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

describe('Toolbar', () => {
  it('uses one tab stop and moves focus with arrows, Home and End, skipping disabled controls', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Toolbar aria-label="Formatting">
          <ToolbarButton>Bold</ToolbarButton>
          <ToolbarButton disabled focusableWhenDisabled={false}>
            Italic
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>Link</ToolbarButton>
        </Toolbar>
        <button type="button">After toolbar</button>
      </>,
    )
    expect(screen.getByRole('toolbar', { name: 'Formatting' })).toBeInTheDocument()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Link' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('button', { name: 'Link' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'After toolbar' })).toHaveFocus()
  })

  it('skips hidden edge buttons and preserves Home/End inside an editable input', async () => {
    const user = userEvent.setup()
    render(
      <Toolbar aria-label="Tools">
        <ToolbarButton style={{ display: 'none' }}>Hidden first</ToolbarButton>
        <ToolbarButton>First</ToolbarButton>
        <ToolbarButton>Last</ToolbarButton>
        <ToolbarButton hidden>Hidden last</ToolbarButton>
        <input aria-label="Inline field" defaultValue="value" />
      </Toolbar>,
    )
    await user.click(screen.getByRole('button', { name: 'First' }))
    await user.keyboard('{End}')
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
    const input = screen.getByRole('textbox', { name: 'Inline field' })
    await user.click(input)
    await user.keyboard('{Home}{End}')
    expect(input).toHaveFocus()
  })

  it('forwards consumer pressed state and prevents disabled activation', async () => {
    const user = userEvent.setup()
    const action = vi.fn()
    function Example() {
      const [pressed, setPressed] = useState(false)
      return (
        <Toolbar aria-label="Formatting">
          <ToolbarButton aria-pressed={pressed} onClick={() => setPressed(!pressed)}>
            Bold
          </ToolbarButton>
          <ToolbarButton disabled onClick={action}>
            Disabled
          </ToolbarButton>
        </Toolbar>
      )
    }
    render(<Example />)
    await user.tab()
    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Disabled' }))
    expect(action).not.toHaveBeenCalled()
  })
})
