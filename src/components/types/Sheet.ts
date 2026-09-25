import type { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

type SheetSide = 'top' | 'right' | 'bottom' | 'left'
type SheetVariant = 'default' | 'sidebar'

type SheetContentProps = DialogPrimitive.Popup.Props & {
  side?: SheetSide
  showCloseButton?: boolean
  variant?: SheetVariant
}

type SheetOverlayProps = DialogPrimitive.Backdrop.Props & {
  variant?: SheetVariant
}

export type { SheetContentProps, SheetOverlayProps, SheetSide, SheetVariant }
