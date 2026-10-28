import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { forwardRef } from 'react'
import { Check, Minus } from '../icons'
import { mergeClassName } from '../lib/utils'
import type { CheckboxProps } from './types/Checkbox'

const Checkbox = forwardRef<HTMLElement, CheckboxProps>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={mergeClassName(
      'group peer grid size-4 shrink-0 cursor-pointer place-content-center rounded-sm border border-primary shadow outline-none focus-visible:ring-1 focus-visible:ring-ring data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="grid place-content-center text-current"
    >
      <Check aria-hidden="true" className="size-4 group-data-[indeterminate]:hidden" />
      <Minus aria-hidden="true" className="hidden size-4 group-data-[indeterminate]:block" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'

export type { CheckboxProps }
export { Checkbox }
