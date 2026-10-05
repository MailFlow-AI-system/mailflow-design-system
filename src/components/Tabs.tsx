import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { forwardRef } from 'react'
import { mergeClassName } from '../lib/utils'
import type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from './types/Tabs'

const Tabs = forwardRef<HTMLDivElement, TabsProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    data-slot="tabs"
    className={mergeClassName('flex flex-col gap-2', className)}
    {...props}
  />
))
Tabs.displayName = 'Tabs'

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    className={mergeClassName(
      'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

const TabsTrigger = forwardRef<HTMLElement, TabsTriggerProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab
    ref={ref}
    data-slot="tabs-trigger"
    className={mergeClassName(
      'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow data-[orientation=vertical]:w-full',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Panel
    ref={ref}
    data-slot="tabs-content"
    className={mergeClassName(
      'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'

export type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps }
export { Tabs, TabsContent, TabsList, TabsTrigger }
