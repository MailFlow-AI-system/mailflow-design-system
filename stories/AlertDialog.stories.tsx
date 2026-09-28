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
