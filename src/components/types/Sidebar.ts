import type { useRender } from '@base-ui/react/use-render'
import type * as React from 'react'
import type { Button } from '../Button'

type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

type SidebarProviderProps = React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type SidebarProps = React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}

type SidebarTriggerProps = React.ComponentProps<typeof Button>
type SidebarPartProps = React.ComponentProps<'div'>
type SidebarListProps = React.ComponentProps<'ul'>
type SidebarListItemProps = React.ComponentProps<'li'>
type SidebarSeparatorProps = React.ComponentProps<'hr'>
type SidebarRailProps = React.ComponentProps<'button'>

type SidebarMenuButtonProps = useRender.ComponentProps<'button'> &
  React.ComponentProps<'button'> & {
    isActive?: boolean
    tooltip?: string
    variant?: 'default' | 'outline'
    size?: 'default' | 'sm' | 'lg'
  }

type SidebarGroupLabelProps = useRender.ComponentProps<'div'> & React.ComponentProps<'div'>
type SidebarGroupActionProps = useRender.ComponentProps<'button'> & React.ComponentProps<'button'>

type SidebarMenuActionProps = useRender.ComponentProps<'button'> &
  React.ComponentProps<'button'> & {
    showOnHover?: boolean
  }

type SidebarMenuSubButtonProps = useRender.ComponentProps<'a'> &
  React.ComponentProps<'a'> & {
    size?: 'sm' | 'md'
    isActive?: boolean
  }

export type {
  SidebarContextProps,
  SidebarGroupActionProps,
  SidebarGroupLabelProps,
  SidebarListItemProps,
  SidebarListProps,
  SidebarMenuActionProps,
  SidebarMenuButtonProps,
  SidebarMenuSubButtonProps,
  SidebarPartProps,
  SidebarProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarTriggerProps,
}
