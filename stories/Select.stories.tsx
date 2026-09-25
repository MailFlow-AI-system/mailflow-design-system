import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../src/components/Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: 'A keyboard-accessible popup for selecting one option from a list.',
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Select defaultValue="inbox">
      <SelectTrigger aria-label="Mailbox">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="inbox">Inbox</SelectItem>
        <SelectItem value="sent">Sent</SelectItem>
        <SelectItem value="drafts">Drafts</SelectItem>
      </SelectContent>
    </Select>
  ),
}
