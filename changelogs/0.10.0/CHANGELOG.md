# 0.10.0

Add tooltips, empty states, and message action icons for email quick actions.

## Added

- `TooltipProvider`, `Tooltip`, `TooltipTrigger`, and `TooltipContent`, styled Base UI tooltip parts that show a short visible label on hover and keyboard focus and close on Escape or pointer leave. `TooltipContent` accepts `side`, `align`, `sideOffset` (default 4), and `alignOffset`.
- `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and `EmptyContent`, a composable centered empty state. Every part accepts Base UI `render` composition; `EmptyMedia` is hidden from assistive technology.
- Icons `Archive`, `ArchiveRestore`, `MailOpen`, `RotateCcw`, and `StarOff`.
- Storybook examples for message action tooltips, folder and search empty states, and confirmations for moving messages to Trash and deleting them permanently.

## SemVer impact

Minor feature under the repository's pre-1.0 policy. Existing public APIs and foundation tokens remain unchanged.

## Public contract

The new components and their `*Props` types are available from `@mailflow/ui/components` and the package root; the icons are available from `@mailflow/ui/icons` and the package root. A tooltip does not name its trigger: icon-only triggers still need an `aria-label`. Consumers choose the empty-state heading level through `render`, and own all copy, actions, and folder rules.

## Migration guidance

After the `v0.10.0` tag and GitHub Release exist, update consumer applications to that exact tag and refresh their lockfile. Icon-only actions may replace native `title` attributes with `Tooltip`. Mount one `TooltipProvider` near the application root to share delays between adjacent tooltips.

## Listening

The reference prototype (`mailflow-ai-suite`) styles tooltips with the `primary` surface, `primary-foreground` text, 12px type, and `rounded-md`; this release keeps those values. Its only empty state is a faded 40px icon above muted text, which `EmptyMedia` and `EmptyDescription` reproduce, adding a title and an action slot for folder and search states the reference does not define.

Confirmation dialogs stay a composition of `AlertDialog`: delete, bulk delete, permanent delete, and emptying Trash differ only in copy and consequence, which belong to the application. Email list rows and the selection bar also remain in the application, which already composes them from `Checkbox`, `Toolbar`, and `Button`. A star toggle is not added: `ToolbarButton` and `Button` with `aria-pressed` already express pressed state.
