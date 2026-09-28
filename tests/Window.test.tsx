import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  Input,
  Window,
  WindowBody,
  WindowClose,
  WindowContent,
  WindowDescription,
  WindowMaximize,
  WindowMinimize,
  WindowMinimized,
  WindowRestore,
  WindowTitle,
  WindowTrigger,
} from '@mailflow/ui/components'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

function Workspace({ guarded = false }: { guarded?: boolean }) {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button type="button">Outside</button>
      <Window
        open={open}
        onOpenChange={(next, details) => {
          if (!next && guarded) {
            details.cancel()
            setConfirm(true)
          } else setOpen(next)
        }}
      >
        <WindowTrigger ref={triggerRef}>Open workspace</WindowTrigger>
        <WindowContent>
          <WindowTitle>Workspace</WindowTitle>
          <WindowDescription>Persistent work surface</WindowDescription>
          <WindowBody>
            <label htmlFor="note">Note</label>
            <Input id="note" />
            <WindowMinimize />
            <WindowMaximize />
            <WindowClose>Close workspace</WindowClose>
          </WindowBody>
        </WindowContent>
        <WindowMinimized aria-label="Minimized workspace">
          <WindowRestore />
          <WindowClose>Close minimized workspace</WindowClose>
        </WindowMinimized>
        <AlertDialog open={confirm} onOpenChange={setConfirm}>
          <AlertDialogContent
            initialFocus={cancelRef}
            finalFocus={() => (open ? true : triggerRef.current)}
          >
            <AlertDialogTitle>Close without saving?</AlertDialogTitle>
            <AlertDialogDescription>Changes will be lost.</AlertDialogDescription>
            <AlertDialogClose ref={cancelRef}>Keep editing</AlertDialogClose>
            <AlertDialogClose onClick={() => setOpen(false)}>Confirm close</AlertDialogClose>
          </AlertDialogContent>
        </AlertDialog>
      </Window>
    </>
  )
}

describe('Window', () => {
  it('preserves the same uncontrolled input and selection through all size transitions', async () => {
    const user = userEvent.setup()
    render(<Workspace />)
    await user.click(screen.getByRole('button', { name: 'Open workspace' }))
    const input = screen.getByRole('textbox', { name: 'Note' }) as HTMLInputElement
    await user.type(input, 'Keep this work')
    input.setSelectionRange(2, 5)
    await user.click(screen.getByRole('button', { name: 'Maximize window' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('data-window-state', 'maximized')
    await user.click(screen.getByRole('button', { name: 'Minimize window' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('region', { name: 'Minimized workspace' })).toBeVisible()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Restore window' })).toHaveFocus(),
    )
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    await user.click(screen.getByRole('button', { name: 'Restore window' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('data-window-state', 'maximized')
    expect(screen.getByRole('textbox', { name: 'Note' })).toBe(input)
    expect(input).toHaveValue('Keep this work')
    expect(input.selectionStart).toBe(2)
    expect(input.selectionEnd).toBe(5)
    await user.click(screen.getByRole('button', { name: 'Restore window size' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('data-window-state', 'normal')
  })

  it('names the modal, traps focus, ignores outside presses, and returns focus after Escape', async () => {
    const user = userEvent.setup()
    render(<Workspace />)
    const trigger = screen.getByRole('button', { name: 'Open workspace' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Workspace' })
    expect(dialog).toHaveAccessibleDescription('Persistent work surface')
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Note' })).toHaveFocus())
    await user.tab({ shift: true })
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Close workspace' })).toHaveFocus(),
    )
    await user.tab()
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Note' })).toHaveFocus())
    fireEvent.pointerDown(document.body)
    expect(dialog).toBeVisible()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it.each(['button', 'escape', 'minimized'] as const)(
    'allows the consumer to guard %s close and cancel without losing work',
    async (method) => {
      const user = userEvent.setup()
      render(<Workspace guarded />)
      await user.click(screen.getByRole('button', { name: 'Open workspace' }))
      await user.type(screen.getByRole('textbox', { name: 'Note' }), 'Unsaved content')
      if (method === 'minimized') {
        await user.click(screen.getByRole('button', { name: 'Minimize window' }))
        await user.click(screen.getByRole('button', { name: 'Close minimized workspace' }))
      } else if (method === 'escape') await user.keyboard('{Escape}')
      else await user.click(screen.getByRole('button', { name: 'Close workspace' }))
      expect(screen.getByRole('alertdialog', { name: 'Close without saving?' })).toBeVisible()
      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Keep editing' })).toHaveFocus(),
      )
      await user.click(screen.getByRole('button', { name: 'Keep editing' }))
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
      if (method === 'minimized')
        await user.click(screen.getByRole('button', { name: 'Restore window' }))
      expect(screen.getByRole('textbox', { name: 'Note' })).toHaveValue('Unsaved content')
      await user.click(screen.getByRole('button', { name: 'Close workspace' }))
      await user.click(screen.getByRole('button', { name: 'Confirm close' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      expect(screen.queryByRole('region', { name: 'Minimized workspace' })).not.toBeInTheDocument()
      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Open workspace' })).toHaveFocus(),
      )
    },
  )

  it('restores the preceding size after externally controlled state changes', async () => {
    const user = userEvent.setup()
    const onStateChange = vi.fn()
    function Example({ state }: { state: 'normal' | 'minimized' | 'maximized' }) {
      return (
        <Window defaultOpen state={state} onStateChange={onStateChange}>
          <WindowContent>
            <WindowTitle>Controlled</WindowTitle>
            <WindowClose>Close</WindowClose>
          </WindowContent>
          <WindowMinimized aria-label="Minimized workspace">
            <WindowRestore />
          </WindowMinimized>
        </Window>
      )
    }
    const { rerender } = render(<Example state="maximized" />)
    rerender(<Example state="minimized" />)
    await user.click(screen.getByRole('button', { name: 'Restore window' }))
    expect(onStateChange).toHaveBeenCalledWith('maximized')
  })

  it('merges a consumer restore ref with its own minimize focus target', async () => {
    const user = userEvent.setup()
    const restoreRef = createRef<HTMLButtonElement>()
    render(
      <Window defaultOpen>
        <WindowContent>
          <WindowTitle>Workspace</WindowTitle>
          <WindowMinimize />
          <WindowClose>Close</WindowClose>
        </WindowContent>
        <WindowMinimized aria-label="Minimized workspace">
          <WindowRestore ref={restoreRef} />
        </WindowMinimized>
      </Window>,
    )
    await user.click(screen.getByRole('button', { name: 'Minimize window' }))
    expect(restoreRef.current).toBe(screen.getByRole('button', { name: 'Restore window' }))
    await waitFor(() => expect(restoreRef.current).toHaveFocus())
  })

  it('respects controlled state and disabled state controls', async () => {
    const user = userEvent.setup()
    const onStateChange = vi.fn()
    render(
      <Window defaultOpen state="normal" onStateChange={onStateChange}>
        <WindowContent>
          <WindowTitle>Controlled workspace</WindowTitle>
          <WindowMinimize disabled />
          <WindowMaximize />
          <WindowClose>Close</WindowClose>
        </WindowContent>
      </Window>,
    )
    await user.click(screen.getByRole('button', { name: 'Minimize window' }))
    expect(onStateChange).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Maximize window' }))
    expect(onStateChange).toHaveBeenCalledWith('maximized')
    expect(screen.getByRole('dialog')).toHaveAttribute('data-window-state', 'normal')
  })
})
