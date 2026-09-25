import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../src/components/Sidebar'
import { Inbox, Settings, Users } from '../src/icons'

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component:
          'Responsive application navigation with desktop collapse and mobile drawer behavior.',
      },
    },
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger aria-label="Toggle navigation" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive render={<a href="#inbox" />}>
                    <Inbox aria-hidden="true" />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#team" />}>
                    <Users aria-hidden="true" />
                    <span>Team</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#settings" />}>
                    <Settings aria-hidden="true" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="min-h-96 flex-1 p-6">
        <p className="text-sm text-muted-foreground">
          Resize the viewport to preview mobile behavior.
        </p>
      </main>
    </SidebarProvider>
  ),
}
