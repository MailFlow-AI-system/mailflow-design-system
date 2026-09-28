import { AlertDialog as Primitive } from '@base-ui/react/alert-dialog'
import { mergeClassName } from '../lib/utils'
import type {
  AlertDialogCloseProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
} from './types/AlertDialog'

function AlertDialog(props: AlertDialogProps) {
  return <Primitive.Root {...props} />
}
function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  return <Primitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}
function AlertDialogClose(props: AlertDialogCloseProps) {
  return <Primitive.Close data-slot="alert-dialog-close" {...props} />
}
function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  return (
    <Primitive.Portal>
      <Primitive.Backdrop className="fixed inset-0 z-50 bg-black/80" />
      <Primitive.Popup
        data-slot="alert-dialog-content"
        className={mergeClassName(
          'fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-auto rounded-xl border border-border bg-background p-6 text-foreground shadow-lg outline-none',
          className,
        )}
        {...props}
      />
    </Primitive.Portal>
  )
}
function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <Primitive.Title
      data-slot="alert-dialog-title"
      className={mergeClassName('text-lg font-semibold', className)}
      {...props}
    />
  )
}
function AlertDialogDescription({ className, ...props }: AlertDialogDescriptionProps) {
  return (
    <Primitive.Description
      data-slot="alert-dialog-description"
      className={mergeClassName('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export type {
  AlertDialogCloseProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
}
export {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
}
