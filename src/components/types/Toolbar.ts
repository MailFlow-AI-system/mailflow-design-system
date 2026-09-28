import type { Toolbar as Primitive } from '@base-ui/react/toolbar'

type ToolbarProps = Primitive.Root.Props & { 'aria-label': string }
type ToolbarButtonProps = Primitive.Button.Props
type ToolbarSeparatorProps = Primitive.Separator.Props

export type { ToolbarButtonProps, ToolbarProps, ToolbarSeparatorProps }
