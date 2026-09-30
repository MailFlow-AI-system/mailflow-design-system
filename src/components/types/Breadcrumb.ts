import type { ComponentPropsWithoutRef, ReactElement } from 'react'

type BreadcrumbProps = ComponentPropsWithoutRef<'nav'>
type BreadcrumbListProps = ComponentPropsWithoutRef<'ol'>
type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'>
type BreadcrumbLinkProps = ComponentPropsWithoutRef<'a'> & { render?: ReactElement }
type BreadcrumbPageProps = ComponentPropsWithoutRef<'span'>
type BreadcrumbSeparatorProps = ComponentPropsWithoutRef<'li'>

export type {
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
}
