import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Toolbar, ToolbarButton, ToolbarSeparator } from '../src/components'
import { Bold, Italic, Link2, Underline } from '../src/icons'

const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  args: { 'aria-label': 'Formatting' },
  parameters: {
    docs: {
      description: {
        component:
          'A named group of controls. Tab enters once, arrows move between controls, and Home/End move to the edges. The consumer owns pressed state and actions.',
      },
    },
  },
} satisfies Meta<typeof Toolbar>
export default meta
type Story = StoryObj<typeof meta>
export const Formatting: Story = {
  render: () => {
    const [bold, setBold] = useState(false)
    return (
      <Toolbar aria-label="Formatting">
        <ToolbarButton aria-label="Bold" aria-pressed={bold} onClick={() => setBold(!bold)}>
          <Bold aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic">
          <Italic aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Underline" disabled>
          <Underline aria-hidden="true" />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton aria-label="Insert link">
          <Link2 aria-hidden="true" />
        </ToolbarButton>
      </Toolbar>
    )
  },
}
