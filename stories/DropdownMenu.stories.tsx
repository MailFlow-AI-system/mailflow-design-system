import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../src/components/DropdownMenu'

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component: 'A menu of actions or options revealed from a trigger.',
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-md border border-input bg-background px-4 py-2 text-sm">
        Account actions
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
