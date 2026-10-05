import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import { forwardRef } from 'react'
import { mergeClassName } from '../lib/utils'
import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from './types/Avatar'

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    className={mergeClassName(
      'relative flex size-10 shrink-0 overflow-hidden rounded-full',
      className,
    )}
    {...props}
  />
))
Avatar.displayName = 'Avatar'

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      data-slot="avatar-image"
      className={mergeClassName(
        'absolute inset-0 block size-full object-cover data-[loading]:invisible data-[error]:invisible',
        className,
      )}
      {...props}
    />
  ),
)
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={mergeClassName(
        'flex size-full items-center justify-center rounded-full bg-muted',
        className,
      )}
      {...props}
    />
  ),
)
AvatarFallback.displayName = 'AvatarFallback'

export type { AvatarFallbackProps, AvatarImageProps, AvatarProps }
export { Avatar, AvatarFallback, AvatarImage }
