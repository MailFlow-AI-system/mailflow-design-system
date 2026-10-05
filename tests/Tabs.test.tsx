import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/components/Tabs'

describe('Tabs', () => {
  it('switches panels and preserves tab-to-panel accessibility relationships', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <Tabs defaultValue="account" onValueChange={onValueChange}>
        <TabsList aria-label="Account settings">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className={({ active }) => (active ? 'custom-active' : '')}>
            Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account details</TabsContent>
        <TabsContent value="billing">Billing details</TabsContent>
        <TabsContent value="security">Security details</TabsContent>
      </Tabs>,
    )

    const accountTab = screen.getByRole('tab', { name: 'Account' })
    const accountPanel = screen.getByRole('tabpanel')
    const securityTab = screen.getByRole('tab', { name: 'Security' })

    expect(accountTab).toHaveAttribute('aria-selected', 'true')
    expect(accountTab).toHaveAttribute('aria-controls', accountPanel.id)
    expect(accountPanel).toHaveAttribute('aria-labelledby', accountTab.id)
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-disabled', 'true')
    expect(securityTab).not.toHaveClass('custom-active')

    await user.click(screen.getByRole('tab', { name: 'Billing' }))
    expect(onValueChange).not.toHaveBeenCalled()

    await user.click(securityTab)

    expect(onValueChange).toHaveBeenCalledWith('security', expect.anything())
    expect(securityTab).toHaveAttribute('aria-selected', 'true')
    expect(securityTab).toHaveClass('custom-active')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Security details')
  })

  it('lets controlled state choose the active tab', async () => {
    const user = userEvent.setup()

    function ControlledTabs() {
      const [value, setValue] = useState('overview')

      return (
        <Tabs value={value} onValueChange={(nextValue) => setValue(nextValue as string)}>
          <TabsList aria-label="Workspace">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview panel</TabsContent>
          <TabsContent value="activity">Activity panel</TabsContent>
        </Tabs>
      )
    }

    render(<ControlledTabs />)
    await user.click(screen.getByRole('tab', { name: 'Activity' }))

    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel')
  })

  it('uses orientation-aware arrow keys and Home and End navigation', async () => {
    const user = userEvent.setup()

    render(
      <Tabs defaultValue="first" orientation="vertical">
        <TabsList aria-label="Preferences">
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
          <TabsTrigger value="third">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="first">First panel</TabsContent>
        <TabsContent value="second">Second panel</TabsContent>
        <TabsContent value="third">Third panel</TabsContent>
      </Tabs>,
    )

    const firstTab = screen.getByRole('tab', { name: 'First' })
    const secondTab = screen.getByRole('tab', { name: 'Second' })
    const thirdTab = screen.getByRole('tab', { name: 'Third' })

    await user.click(firstTab)
    await user.keyboard('{ArrowDown}')
    expect(secondTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Enter}')
    expect(secondTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{End}')
    expect(thirdTab).toHaveFocus()
    await user.keyboard('{Home}')
    expect(firstTab).toHaveFocus()
  })
})
