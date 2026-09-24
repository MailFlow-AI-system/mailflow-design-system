import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { forwardRef } from 'react'
import { ChevronRight } from '../icons'

import { mergeClassName } from '../lib/utils'

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={mergeClassName('flex flex-col', className)}
      {...props}
    />
  )
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionPrimitive.Item.Props>(
  ({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
      ref={ref}
      data-slot="accordion-item"
      className={mergeClassName('border-b last:border-b-0', className)}
      {...props}
    />
  ),
)
AccordionItem.displayName = 'AccordionItem'

const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionPrimitive.Header.Props>(
  ({ className, ...props }, ref) => (
    <AccordionPrimitive.Header
      ref={ref}
      data-slot="accordion-header"
      className={mergeClassName('flex', className)}
      {...props}
    />
  ),
)
AccordionHeader.displayName = 'AccordionHeader'

const AccordionTrigger = forwardRef<HTMLElement, AccordionPrimitive.Trigger.Props>(
  ({ children, className, ...props }, ref) => (
    <AccordionPrimitive.Trigger
      ref={ref}
      data-slot="accordion-trigger"
      className={mergeClassName(
        'flex w-full flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&[data-panel-open]>svg]:rotate-90',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight
        aria-hidden="true"
        className="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform"
      />
    </AccordionPrimitive.Trigger>
  ),
)
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = forwardRef<HTMLDivElement, AccordionPrimitive.Panel.Props>(
  ({ children, className, ...props }, ref) => (
    <AccordionPrimitive.Panel
      ref={ref}
      data-slot="accordion-content"
      className={mergeClassName(
        'overflow-hidden text-sm text-muted-foreground data-[open]:pt-3',
        className,
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Panel>
  ),
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger }
