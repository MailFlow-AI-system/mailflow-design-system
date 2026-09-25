import {
  Sidebar,
  SidebarContent,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@mailflow/ui/components'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Sidebar', () => {
  it('collapses and expands from its trigger', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarTrigger aria-label="Toggle navigation" />
          <SidebarContent>
            <SidebarMenuItem>
              <SidebarMenuButton>Inbox</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    )

    const sidebar = container.querySelector('[data-slot="sidebar"]')
    expect(sidebar).toHaveAttribute('data-state', 'expanded')

    fireEvent.click(screen.getByRole('button', { name: 'Toggle navigation' }))
    expect(sidebar).toHaveAttribute('data-state', 'collapsed')

    fireEvent.click(screen.getByRole('button', { name: 'Toggle navigation' }))
    expect(sidebar).toHaveAttribute('data-state', 'expanded')
  })

  it('requires a provider for useSidebar', () => {
    expect(() => render(<Sidebar />)).toThrow('useSidebar must be used within a SidebarProvider.')
  })
})
