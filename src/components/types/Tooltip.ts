import type { Tooltip as Primitive } from '@base-ui/react/tooltip'

type TooltipProviderProps = Primitive.Provider.Props
type TooltipProps = Primitive.Root.Props
type TooltipTriggerProps = Primitive.Trigger.Props
type TooltipContentProps = Primitive.Popup.Props &
  Pick<Primitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>

export type { TooltipContentProps, TooltipProps, TooltipProviderProps, TooltipTriggerProps }
