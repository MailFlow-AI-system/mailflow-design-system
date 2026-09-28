import type { AlertDialog as Primitive } from '@base-ui/react/alert-dialog'

type AlertDialogProps = Primitive.Root.Props
type AlertDialogContentProps = Primitive.Popup.Props
type AlertDialogTitleProps = Primitive.Title.Props
type AlertDialogDescriptionProps = Primitive.Description.Props
type AlertDialogCloseProps = Primitive.Close.Props
type AlertDialogTriggerProps = Primitive.Trigger.Props

export type {
  AlertDialogCloseProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
}
