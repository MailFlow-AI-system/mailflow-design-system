import type { Dialog } from '@base-ui/react/dialog'
import type { HTMLAttributes, ReactNode, RefObject } from 'react'
import type { ButtonProps } from '../Button'

type WindowState = 'normal' | 'minimized' | 'maximized'
type WindowOpenChangeDetails = {
  reason: Dialog.Root.ChangeEventReason
  cancel: () => void
}
type WindowProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: WindowOpenChangeDetails) => void
  state?: WindowState
  defaultState?: WindowState
  onStateChange?: (state: WindowState) => void
}
type WindowContentProps = Dialog.Popup.Props
type WindowTriggerProps = Dialog.Trigger.Props
type WindowCloseProps = Dialog.Close.Props
type WindowControlProps = ButtonProps
type WindowMinimizedProps = HTMLAttributes<HTMLElement> & { 'aria-label': string }
type WindowContextValue = {
  open: boolean
  state: WindowState
  setState: (state: WindowState) => void
  restore: () => void
  requestClose: () => void
  lastFocus: RefObject<HTMLElement | null>
  restoreRef: RefObject<HTMLButtonElement | null>
  triggerRef: RefObject<HTMLButtonElement | null>
}

export type {
  WindowCloseProps,
  WindowContentProps,
  WindowContextValue,
  WindowControlProps,
  WindowMinimizedProps,
  WindowOpenChangeDetails,
  WindowProps,
  WindowState,
  WindowTriggerProps,
}
