import type { Select as SelectPrimitive } from '@base-ui/react/select'
import type * as React from 'react'

type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
  icon?: React.ReactElement
}

type SelectContentProps = SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >

type SelectItemProps = SelectPrimitive.Item.Props
type SelectScrollUpButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>
type SelectScrollDownButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>

export type {
  SelectContentProps,
  SelectItemProps,
  SelectScrollDownButtonProps,
  SelectScrollUpButtonProps,
  SelectTriggerProps,
}
