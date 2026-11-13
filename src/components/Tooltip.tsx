import { Tooltip as Primitive } from '@base-ui/react/tooltip'
import { mergeClassName } from '../lib/utils'
import type {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from './types/Tooltip'

function TooltipProvider(props: TooltipProviderProps) {
  return <Primitive.Provider {...props} />
}

function Tooltip(props: TooltipProps) {
  return <Primitive.Root {...props} />
}

function TooltipTrigger(props: TooltipTriggerProps) {
  return <Primitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  align = 'center',
  alignOffset,
  className,
  side = 'top',
  sideOffset = 4,
  ...props
}: TooltipContentProps) {
  return (
    <Primitive.Portal>
      <Primitive.Positioner
        data-slot="tooltip-positioner"
        className="z-50"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <Primitive.Popup
          data-slot="tooltip-content"
          className={mergeClassName(
            'max-w-xs rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
            className,
          )}
          {...props}
        />
      </Primitive.Positioner>
    </Primitive.Portal>
  )
}

export type { TooltipContentProps, TooltipProps, TooltipProviderProps, TooltipTriggerProps }
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
