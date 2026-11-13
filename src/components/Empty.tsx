import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '../lib/utils'

type EmptyProps = useRender.ComponentProps<'div'>
type EmptyHeaderProps = useRender.ComponentProps<'div'>
type EmptyMediaProps = useRender.ComponentProps<'div'>
type EmptyTitleProps = useRender.ComponentProps<'div'>
type EmptyDescriptionProps = useRender.ComponentProps<'p'>
type EmptyContentProps = useRender.ComponentProps<'div'>

function useEmptyDiv(
  slot: string,
  baseClassName: string,
  { className, render, ...props }: useRender.ComponentProps<'div'>,
  extra: useRender.ElementProps<'div'> = {},
) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        'data-slot': slot,
        className: cn(baseClassName, className),
        ...extra,
      } as useRender.ElementProps<'div'>,
      props,
    ),
    render,
  })
}

function Empty(props: EmptyProps) {
  return useEmptyDiv(
    'empty',
    'flex min-w-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center text-balance',
    props,
  )
}

function EmptyHeader(props: EmptyHeaderProps) {
  return useEmptyDiv('empty-header', 'flex max-w-sm flex-col items-center gap-2', props)
}

function EmptyMedia(props: EmptyMediaProps) {
  return useEmptyDiv(
    'empty-media',
    'mb-2 flex shrink-0 items-center justify-center text-muted-foreground opacity-60 [&_svg]:pointer-events-none [&_svg]:size-10 [&_svg]:shrink-0',
    props,
    { 'aria-hidden': true },
  )
}

function EmptyTitle(props: EmptyTitleProps) {
  return useEmptyDiv('empty-title', 'text-sm font-semibold text-foreground', props)
}

function EmptyDescription({ className, render, ...props }: EmptyDescriptionProps) {
  return useRender({
    defaultTagName: 'p',
    props: mergeProps<'p'>(
      {
        'data-slot': 'empty-description',
        className: cn('text-sm text-muted-foreground', className),
      } as useRender.ElementProps<'p'>,
      props,
    ),
    render,
  })
}

function EmptyContent(props: EmptyContentProps) {
  return useEmptyDiv(
    'empty-content',
    'flex w-full max-w-sm flex-wrap items-center justify-center gap-2',
    props,
  )
}

export type {
  EmptyContentProps,
  EmptyDescriptionProps,
  EmptyHeaderProps,
  EmptyMediaProps,
  EmptyProps,
  EmptyTitleProps,
}
export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }
