import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@mailflow/ui/components'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Breadcrumb', () => {
  it('renders a semantic navigation hierarchy', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<a href="/mail" />}>Mail</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inbox</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Mail' })).toHaveAttribute('href', '/mail')
    expect(screen.getByText('Inbox')).toHaveAttribute('aria-current', 'page')
    expect(container.querySelector('[data-slot="breadcrumb-separator"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('supports a custom separator', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>,
    )

    expect(container.querySelector('[data-slot="breadcrumb-separator"]')).toHaveTextContent('/')
  })
})
