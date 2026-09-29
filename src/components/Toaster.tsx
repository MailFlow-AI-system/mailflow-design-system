import { CircleCheck, Info, Loader2, OctagonX, TriangleAlert } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Toaster as SonnerToaster, type ToasterProps } from 'sonner'

import { cn } from '../lib/utils'

function Toaster({ className, icons, style, ...props }: ToasterProps) {
  return (
    <SonnerToaster
      className={cn('mailflow-toaster', className)}
      position="bottom-right"
      icons={{
        success: <CircleCheck aria-hidden="true" size={16} />,
        info: <Info aria-hidden="true" size={16} />,
        warning: <TriangleAlert aria-hidden="true" size={16} />,
        error: <OctagonX aria-hidden="true" size={16} />,
        loading: <Loader2 aria-hidden="true" size={16} className="animate-spin" />,
        ...icons,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  )
}

export type { ExternalToast, ToastClassnames } from 'sonner'
export { toast } from 'sonner'
export { Toaster, type ToasterProps }
