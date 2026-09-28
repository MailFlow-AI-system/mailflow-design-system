import { Dialog } from '@base-ui/react/dialog'
import * as React from 'react'
import { Maximize2, Minimize2, Minus } from '../icons'
import { cn, mergeClassName } from '../lib/utils'
import { Button } from './Button'
import type {
  WindowCloseProps,
  WindowContentProps,
  WindowContextValue,
  WindowControlProps,
  WindowMinimizedProps,
  WindowOpenChangeDetails,
  WindowProps,
  WindowState,
  WindowTriggerProps,
} from './types/Window'

const WindowContext = React.createContext<WindowContextValue | null>(null)

function useWindowContext() {
  const context = React.useContext(WindowContext)
  if (!context) throw new Error('Window parts must be rendered inside Window')
  return context
}

function Window({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  state: controlledState,
  defaultState = 'normal',
  onStateChange,
}: WindowProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const [internalState, setInternalState] = React.useState<WindowState>(defaultState)
  const open = controlledOpen ?? internalOpen
  const state = controlledState ?? internalState
  const previousState = React.useRef<WindowState>(
    defaultState === 'maximized' ? 'maximized' : 'normal',
  )
  React.useEffect(() => {
    if (state !== 'minimized') previousState.current = state
  }, [state])
  const lastFocus = React.useRef<HTMLElement | null>(null)
  const restoreRef = React.useRef<HTMLButtonElement | null>(null)

  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const wasOpen = React.useRef(open)
  React.useEffect(() => {
    if (wasOpen.current && !open && state === 'minimized') triggerRef.current?.focus()
    wasOpen.current = open
  }, [open, state])

  function setState(next: WindowState) {
    if (next === state) return
    if (state !== 'minimized') previousState.current = state
    if (controlledState === undefined) setInternalState(next)
    onStateChange?.(next)
  }

  function changeOpen(next: boolean, details: WindowOpenChangeDetails) {
    let cancelled = false
    onOpenChange?.(next, {
      reason: details.reason,
      cancel: () => {
        cancelled = true
        details.cancel()
      },
    })
    if (cancelled) return
    if (next && state === 'minimized') setState(previousState.current)
    if (controlledOpen === undefined) setInternalOpen(next)
  }

  const context: WindowContextValue = {
    open,
    state,
    setState,
    restore: () => setState(previousState.current),
    requestClose: () => changeOpen(false, { reason: 'close-press', cancel: () => {} }),
    lastFocus,
    restoreRef,
    triggerRef,
  }

  return (
    <WindowContext.Provider value={context}>
      <Dialog.Root
        open={open && state !== 'minimized'}
        onOpenChange={changeOpen}
        modal
        disablePointerDismissal
      >
        {children}
      </Dialog.Root>
    </WindowContext.Provider>
  )
}

function setButtonRef(
  ref: React.Ref<HTMLButtonElement> | undefined,
  element: HTMLButtonElement | null,
) {
  if (typeof ref === 'function') return ref(element)
  if (ref) ref.current = element
}

const WindowTrigger = React.forwardRef<HTMLButtonElement, WindowTriggerProps>((props, ref) => {
  const context = useWindowContext()
  return (
    <Dialog.Trigger
      data-slot="window-trigger"
      {...props}
      ref={(element: HTMLButtonElement | null) => {
        context.triggerRef.current = element
        const cleanup = setButtonRef(ref, element)
        if (typeof cleanup === 'function')
          return () => {
            context.triggerRef.current = null
            cleanup()
          }
      }}
    />
  )
})
WindowTrigger.displayName = 'WindowTrigger'

function WindowClose({ onClick, ...props }: WindowCloseProps) {
  const context = useWindowContext()
  return (
    <Dialog.Close
      data-slot="window-close"
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && context.state === 'minimized') {
          event.preventDefault()
          context.requestClose()
        }
      }}
    />
  )
}

const WindowContent = React.forwardRef<HTMLDivElement, WindowContentProps>(
  ({ className, initialFocus, finalFocus, onFocusCapture, ...props }, ref) => {
    const context = useWindowContext()
    return (
      <Dialog.Portal keepMounted>
        <Dialog.Backdrop
          data-slot="window-overlay"
          className="fixed inset-0 z-50 bg-black/80 data-[closed]:hidden"
        />
        <Dialog.Popup
          ref={ref}
          data-slot="window-content"
          data-window-state={context.state}
          className={mergeClassName(
            'fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-border bg-background text-foreground shadow-lg outline-none data-[closed]:hidden sm:rounded-xl data-[window-state=maximized]:h-[calc(100dvh-2rem)] data-[window-state=maximized]:w-[calc(100%-2rem)] data-[window-state=maximized]:max-w-none',
            className,
          )}
          initialFocus={
            initialFocus ??
            (() => (context.lastFocus.current?.isConnected ? context.lastFocus.current : true))
          }
          finalFocus={
            context.open && context.state === 'minimized' ? context.restoreRef : finalFocus
          }
          onFocusCapture={(event) => {
            if (
              event.target instanceof HTMLElement &&
              !event.target.closest('[data-slot="window-state-control"]')
            ) {
              context.lastFocus.current = event.target
            }
            onFocusCapture?.(event)
          }}
          {...props}
        />
      </Dialog.Portal>
    )
  },
)
WindowContent.displayName = 'WindowContent'

function WindowHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="window-header"
      className={cn(
        'flex shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2.5',
        className,
      )}
      {...props}
    />
  )
}

function WindowTitle({ className, ...props }: Dialog.Title.Props) {
  return (
    <Dialog.Title
      data-slot="window-title"
      className={mergeClassName('min-w-0 truncate text-sm font-medium', className)}
      {...props}
    />
  )
}

function WindowDescription({ className, ...props }: Dialog.Description.Props) {
  return (
    <Dialog.Description
      data-slot="window-description"
      className={mergeClassName('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function WindowBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="window-body"
      className={cn('min-h-0 flex-1 overflow-auto', className)}
      {...props}
    />
  )
}

function WindowMinimize({
  onClick,
  children,
  'aria-label': label = 'Minimize window',
  ...props
}: WindowControlProps) {
  const context = useWindowContext()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      aria-label={label}
      data-slot="window-state-control"
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.setState('minimized')
      }}
    >
      {children ?? <Minus aria-hidden="true" />}
    </Button>
  )
}

function WindowMaximize({ onClick, children, 'aria-label': label, ...props }: WindowControlProps) {
  const context = useWindowContext()
  const maximized = context.state === 'maximized'
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      aria-label={label ?? (maximized ? 'Restore window size' : 'Maximize window')}
      data-slot="window-state-control"
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.setState(maximized ? 'normal' : 'maximized')
      }}
    >
      {children ??
        (maximized ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />)}
    </Button>
  )
}

function WindowRestore({
  ref: forwardedRef,
  onClick,
  children,
  'aria-label': label = 'Restore window',
  ...props
}: WindowControlProps) {
  const context = useWindowContext()
  return (
    <Button
      ref={(element: HTMLButtonElement | null) => {
        context.restoreRef.current = element
        const cleanup = setButtonRef(forwardedRef, element)
        if (typeof cleanup === 'function')
          return () => {
            context.restoreRef.current = null
            cleanup()
          }
      }}
      variant="ghost"
      aria-label={label}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.restore()
      }}
    >
      {children ?? <Maximize2 aria-hidden="true" />}
    </Button>
  )
}

function WindowMinimized({ className, ...props }: WindowMinimizedProps) {
  const context = useWindowContext()
  return (
    <Dialog.Portal keepMounted>
      <section
        data-slot="window-minimized"
        hidden={!context.open || context.state !== 'minimized'}
        className={cn(
          'fixed bottom-4 right-4 z-40 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-foreground shadow-lg [&[hidden]]:hidden',
          className,
        )}
        {...props}
      />
    </Dialog.Portal>
  )
}

export type {
  WindowCloseProps,
  WindowContentProps,
  WindowControlProps,
  WindowMinimizedProps,
  WindowOpenChangeDetails,
  WindowProps,
  WindowState,
  WindowTriggerProps,
}
export {
  Window,
  WindowBody,
  WindowClose,
  WindowContent,
  WindowDescription,
  WindowHeader,
  WindowMaximize,
  WindowMinimize,
  WindowMinimized,
  WindowRestore,
  WindowTitle,
  WindowTrigger,
}
