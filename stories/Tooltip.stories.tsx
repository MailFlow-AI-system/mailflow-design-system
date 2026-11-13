import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Button,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../src/components'
import { Archive, Mail, MailOpen, Star, Trash2 } from '../src/icons'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-12">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A short visible label for an icon-only control, shown on hover and keyboard focus. It does not name the control: keep an `aria-label` on the trigger.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>
export default meta
type Story = StoryObj<typeof meta>

export const IconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button aria-label="Archive" size="icon" variant="ghost" />}>
        <Archive aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>Archive</TooltipContent>
    </Tooltip>
  ),
}

export const MessageActions: Story = {
  render: () => {
    const [read, setRead] = useState(false)
    const [starred, setStarred] = useState(false)
    const actions = [
      { label: 'Archive', icon: <Archive aria-hidden="true" /> },
      { label: 'Delete', icon: <Trash2 aria-hidden="true" /> },
    ]
    return (
      <Toolbar aria-label="Message actions" className="w-fit rounded-md border">
        {actions.map((action) => (
          <Tooltip key={action.label}>
            <TooltipTrigger render={<ToolbarButton aria-label={action.label} />}>
              {action.icon}
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        ))}
        <ToolbarSeparator />
        <Tooltip>
          <TooltipTrigger
            render={
              <ToolbarButton
                aria-label={read ? 'Mark as unread' : 'Mark as read'}
                onClick={() => setRead(!read)}
              />
            }
          >
            {read ? <Mail aria-hidden="true" /> : <MailOpen aria-hidden="true" />}
          </TooltipTrigger>
          <TooltipContent>{read ? 'Mark as unread' : 'Mark as read'}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <ToolbarButton
                aria-label="Star"
                aria-pressed={starred}
                onClick={() => setStarred(!starred)}
              />
            }
          >
            <Star
              aria-hidden="true"
              className={starred ? 'fill-warning text-warning' : undefined}
            />
          </TooltipTrigger>
          <TooltipContent>{starred ? 'Unstar' : 'Star'}</TooltipContent>
        </Tooltip>
      </Toolbar>
    )
  },
}
