import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../src/components'
import { Archive, Search, ShieldAlert, Star, Trash2 } from '../src/icons'

const meta = {
  title: 'Components/Empty',
  component: Empty,
  decorators: [
    (Story) => (
      <div className="flex h-80 w-full max-w-md border border-border">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A centered empty state for a list or panel. The consumer chooses the heading level with `render` and owns the copy and actions.',
      },
    },
  },
} satisfies Meta<typeof Empty>
export default meta
type Story = StoryObj<typeof meta>

function Folder({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>{icon}</EmptyMedia>
        <EmptyTitle render={(props) => <h2 {...props} />}>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export const ArchiveFolder: Story = {
  render: () => (
    <Folder
      icon={<Archive />}
      title="No archived messages"
      description="Messages you archive leave the Inbox and wait here."
    />
  ),
}

export const StarredFolder: Story = {
  render: () => (
    <Folder
      icon={<Star />}
      title="No starred messages"
      description="Star a message to find it here later."
    />
  ),
}

export const TrashFolder: Story = {
  render: () => (
    <Folder
      icon={<Trash2 />}
      title="Trash is empty"
      description="Deleted messages stay here until you delete them permanently."
    />
  ),
}

export const SpamFolder: Story = {
  render: () => (
    <Folder icon={<ShieldAlert />} title="No spam" description="Nothing suspicious arrived." />
  ),
}

export const NoSearchResults: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Search />
        </EmptyMedia>
        <EmptyTitle render={(props) => <h2 {...props} />}>No messages match “invoice”</EmptyTitle>
        <EmptyDescription>Check the spelling or try other words.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Clear search
        </Button>
      </EmptyContent>
    </Empty>
  ),
}
