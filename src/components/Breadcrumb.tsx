import * as React from 'react'
import { ChevronRight } from '../icons'

import { cn } from '../lib/utils'
import type {
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from './types/Breadcrumb'

function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return <nav aria-label="Breadcrumb" data-slot="breadcrumb" className={cn(className)} {...props} />
}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-2 break-words text-sm text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
)
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    />
  ),
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ children, className, render, ...props }, ref) => {
    const linkClassName = cn(
      'inline-flex cursor-pointer items-center text-sm text-muted-foreground no-underline transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      className,
    )

    if (!render) {
      return (
        <a ref={ref} data-slot="breadcrumb-link" className={linkClassName} {...props}>
          {children}
        </a>
      )
    }

    const renderProps = render.props as { className?: string }
    return React.cloneElement(
      render,
      {
        ...props,
        ref,
        'data-slot': 'breadcrumb-link',
        className: cn(linkClassName, renderProps.className),
      } as React.Attributes & Record<string, unknown>,
      children,
    )
  },
)
BreadcrumbLink.displayName = 'BreadcrumbLink'

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn('font-medium text-foreground', className)}
      {...props}
    />
  ),
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ children, className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('text-muted-foreground [&_svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight aria-hidden="true" />}
    </li>
  ),
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
