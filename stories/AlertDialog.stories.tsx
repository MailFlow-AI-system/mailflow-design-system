import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '../src/components'

const meta = { title: 'Components/AlertDialog', component: AlertDialog } satisfies Meta<
  typeof AlertDialog
>
export default meta
type Story = StoryObj<typeof meta>
export const Confirmation: Story = {
  render: () => {
    const cancelRef = useRef<HTMLButtonElement>(null)
    return (
      <AlertDialog>
        <AlertDialogTrigger render={<Button />}>Close workspace</AlertDialogTrigger>
        <AlertDialogContent initialFocus={cancelRef}>
          <AlertDialogTitle>Close without saving?</AlertDialogTitle>
          <AlertDialogDescription>Unsaved changes will be lost.</AlertDialogDescription>
          <div className="flex flex-wrap justify-end gap-2">
            <AlertDialogClose render={<Button ref={cancelRef} variant="outline" />}>
              Continue editing
            </AlertDialogClose>
            <AlertDialogClose render={<Button variant="destructive" />}>
              Close without saving
            </AlertDialogClose>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

function MessageConfirmation({
  trigger,
  title,
  description,
  confirm,
}: {
  trigger: string
  title: string
  description: string
  confirm: string
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>{trigger}</AlertDialogTrigger>
      <AlertDialogContent initialFocus={cancelRef}>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <div className="flex flex-wrap justify-end gap-2">
          <AlertDialogClose render={<Button ref={cancelRef} variant="outline" />}>
            Cancel
          </AlertDialogClose>
          <AlertDialogClose render={<Button variant="destructive" />}>{confirm}</AlertDialogClose>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const MoveMessagesToTrash: Story = {
  render: () => (
    <MessageConfirmation
      trigger="Delete 3 messages"
      title="Move 3 messages to Trash?"
      description="You can restore them from Trash until they are deleted permanently."
      confirm="Move to Trash"
    />
  ),
}

export const DeleteMessagesPermanently: Story = {
  render: () => (
    <MessageConfirmation
      trigger="Delete permanently"
      title="Delete 3 messages permanently?"
      description="These messages will be removed from Trash. This cannot be undone."
      confirm="Delete permanently"
    />
  ),
}
