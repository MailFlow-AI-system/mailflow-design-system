import { Toolbar as Primitive } from '@base-ui/react/toolbar'
import { mergeClassName } from '../lib/utils'
import { buttonVariants } from './Button'
import type { ToolbarButtonProps, ToolbarProps, ToolbarSeparatorProps } from './types/Toolbar'

function Toolbar({ className, onKeyDown, ...props }: ToolbarProps) {
  return (
    <Primitive.Root
      data-slot="toolbar"
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (
          event.defaultPrevented ||
          props.disabled ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey
        )
          return
        if (event.key !== 'Home' && event.key !== 'End') return
        const target = event.target as HTMLElement
        if (target.closest('input,textarea,[contenteditable="true"]')) return
        const buttons = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>('[data-slot="toolbar-button"]'),
        ).filter((button) => {
          const style = getComputedStyle(button)
          return (
            !button.hasAttribute('disabled') &&
            !button.closest('[hidden],[inert]') &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            (button.checkVisibility?.() ?? true)
          )
        })
        const button = event.key === 'Home' ? buttons[0] : buttons[buttons.length - 1]
        if (button) {
          event.preventDefault()
          button.focus()
        }
      }}
      className={mergeClassName(
        'flex flex-wrap items-center gap-1 border-t border-border bg-muted/20 px-2 py-1.5',
        className,
      )}
      {...props}
    />
  )
}

function ToolbarButton({ className, ...props }: ToolbarButtonProps) {
  return (
    <Primitive.Button
      data-slot="toolbar-button"
      className={mergeClassName(
        buttonVariants({
          variant: 'ghost',
          size: 'icon',
          className:
            'size-7 aria-disabled:opacity-50 aria-pressed:bg-accent aria-pressed:text-accent-foreground',
        }),
        className,
      )}
      {...props}
    />
  )
}

function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return (
    <Primitive.Separator
      data-slot="toolbar-separator"
      className={mergeClassName(
        'mx-1 bg-border data-[orientation=vertical]:h-4 data-[orientation=vertical]:w-px data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
        className,
      )}
      {...props}
    />
  )
}

export type { ToolbarButtonProps, ToolbarProps, ToolbarSeparatorProps }
export { Toolbar, ToolbarButton, ToolbarSeparator }
