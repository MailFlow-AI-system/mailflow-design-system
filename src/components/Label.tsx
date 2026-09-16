import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '../lib/utils'

const Label = forwardRef<HTMLLabelElement, ComponentPropsWithoutRef<'label'>>(
  ({ className, ...props }, ref) => (
    // biome-ignore lint/a11y/noLabelWithoutControl: Label forwards htmlFor and supports nested controls.
    <label
      ref={ref}
      data-slot="label"
      className={cn(
        'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  ),
)

Label.displayName = 'Label'

export { Label }
