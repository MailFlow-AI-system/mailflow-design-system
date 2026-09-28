import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@mailflow/ui/components'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('AlertDialog', () => {
  it('associates its title and description, traps focus, ignores outside press and restores its trigger', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Request close</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm close</AlertDialogTitle>
          <AlertDialogDescription>There are unsaved changes.</AlertDialogDescription>
          <AlertDialogClose>Cancel</AlertDialogClose>
          <AlertDialogClose>Confirm</AlertDialogClose>
        </AlertDialogContent>
      </AlertDialog>,
    )
    const trigger = screen.getByRole('button', { name: 'Request close' })
    await user.click(trigger)
    const dialog = screen.getByRole('alertdialog', { name: 'Confirm close' })
    expect(dialog).toHaveAccessibleDescription('There are unsaved changes.')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus())
    await user.tab({ shift: true })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus())
    fireEvent.pointerDown(document.body)
    expect(dialog).toBeVisible()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
