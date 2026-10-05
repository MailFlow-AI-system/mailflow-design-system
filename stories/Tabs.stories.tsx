import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/components/Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: 'Keyboard-accessible tabs for switching between related panels.',
      },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="max-w-xl">
      <TabsList aria-label="Workspace">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        Workspace stats and activity.
      </TabsContent>
      <TabsContent value="projects" className="text-sm text-muted-foreground">
        Project milestones and deadlines.
      </TabsContent>
      <TabsContent value="account" className="text-sm text-muted-foreground">
        Profile and preferences.
      </TabsContent>
    </Tabs>
  ),
}

export const EmailTabs: Story = {
  render: () => (
    <Tabs defaultValue="all" className="max-w-xl">
      <TabsList aria-label="Mailbox" className="h-8 rounded-none bg-transparent p-0">
        <TabsTrigger value="all" className="h-7 px-3 text-xs">
          All mail
        </TabsTrigger>
        <TabsTrigger value="unread" className="h-7 px-3 text-xs">
          Unread
        </TabsTrigger>
        <TabsTrigger value="starred" className="h-7 px-3 text-xs">
          Starred
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="text-sm text-muted-foreground">
        All messages in this mailbox.
      </TabsContent>
      <TabsContent value="unread" className="text-sm text-muted-foreground">
        Messages that still need attention.
      </TabsContent>
      <TabsContent value="starred" className="text-sm text-muted-foreground">
        Messages marked as important.
      </TabsContent>
    </Tabs>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="available">
      <TabsList aria-label="Reports">
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="scheduled" disabled>
          Scheduled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="available">Available reports</TabsContent>
      <TabsContent value="scheduled">Scheduled reports</TabsContent>
    </Tabs>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('inbox')

    return (
      <Tabs value={value} onValueChange={(nextValue) => setValue(nextValue as string)}>
        <TabsList aria-label="Mailbox">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">Inbox messages</TabsContent>
        <TabsContent value="sent">Sent messages</TabsContent>
      </Tabs>
    )
  },
}

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="profile" orientation="vertical" className="flex-row items-start gap-4">
      <TabsList aria-label="Settings" className="h-auto items-stretch">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="flex-1">
        Profile settings
      </TabsContent>
      <TabsContent value="security" className="flex-1">
        Security settings
      </TabsContent>
      <TabsContent value="notifications" className="flex-1">
        Notification settings
      </TabsContent>
    </Tabs>
  ),
}
