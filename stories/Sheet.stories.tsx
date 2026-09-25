import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../src/components/Sheet'

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    docs: {
      description: {
        component: 'A modal surface that slides in from one edge of the viewport.',
      },
    },
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
        Open sheet
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Explore shared MailFlow workflows.</SheetDescription>
        </SheetHeader>
        <nav aria-label="Example navigation" className="grid gap-2">
          <a className="rounded-md px-3 py-2 hover:bg-accent" href="#inbox">
            Inbox
          </a>
          <a className="rounded-md px-3 py-2 hover:bg-accent" href="#automations">
            Automations
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
}

export const SidebarVariant: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
        Open sidebar
      </SheetTrigger>
      <SheetContent variant="sidebar" side="left">
        <SheetHeader className="sr-only">
          <SheetTitle>Application navigation</SheetTitle>
          <SheetDescription>Navigate through the MailFlow application.</SheetDescription>
        </SheetHeader>
        <nav aria-label="Application navigation" className="grid gap-2 p-4">
          <a className="rounded-md px-3 py-2 hover:bg-sidebar-accent" href="#inbox">
            Inbox
          </a>
          <a className="rounded-md px-3 py-2 hover:bg-sidebar-accent" href="#settings">
            Settings
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
}
