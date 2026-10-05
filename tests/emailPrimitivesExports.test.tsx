import {
  Avatar,
  AvatarFallback,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@mailflow/ui'
import {
  Avatar as ComponentAvatar,
  Badge as ComponentBadge,
  Tabs as ComponentTabs,
} from '@mailflow/ui/components'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

describe('email primitives public contract', () => {
  it('exposes the same components from both public entrypoints', () => {
    expect(Avatar).toBeDefined()
    expect(Badge).toBeDefined()
    expect(Tabs).toBeDefined()
    expect(Avatar).toBe(ComponentAvatar)
    expect(Badge).toBe(ComponentBadge)
    expect(Tabs).toBe(ComponentTabs)
  })

  it('server-renders fallback initials, labels, and associated tab panels', () => {
    const html = renderToString(
      <>
        <Avatar>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <Badge variant="secondary">Work</Badge>
        <Tabs defaultValue="all">
          <TabsList aria-label="Email views">
            <TabsTrigger value="all">Inbox</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          <TabsContent value="all">All messages</TabsContent>
          <TabsContent value="unread">Unread messages</TabsContent>
        </Tabs>
      </>,
    )
    expect(html).toContain('AL')
    expect(html).toContain('Work')
    expect(html).toContain('role="tablist"')
    expect(html).toContain('aria-selected="true"')
    expect(html).toContain('All messages')
  })
})
