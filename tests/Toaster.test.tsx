import { Toaster, toast } from '@mailflow/ui/components'
import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

describe('Toaster', () => {
  afterEach(() => toast.dismiss())

  it('renders all status variants with the Mailflow presentation', async () => {
    render(<Toaster />)

    act(() => {
      toast('Draft saved')
      toast.success('Message sent')
      toast.info('Sync in progress')
      toast.warning('Storage almost full')
      toast.error('Unable to send message')
    })

    expect(await screen.findByText('Draft saved')).toBeInTheDocument()
    for (const [type, title] of [
      ['success', 'Message sent'],
      ['info', 'Sync in progress'],
      ['warning', 'Storage almost full'],
      ['error', 'Unable to send message'],
    ]) {
      expect(screen.getByText(title).closest('[data-sonner-toast]')).toHaveAttribute(
        'data-type',
        type,
      )
    }
    expect(document.querySelector('.mailflow-toaster')).toBeInTheDocument()
  })

  it('passes Sonner customization through to the host application', async () => {
    render(
      <Toaster
        className="application-toaster"
        position="top-center"
        closeButton
        style={{ '--mailflow-toast-error': 'purple' } as React.CSSProperties}
      />,
    )

    act(() => {
      toast.error('Custom error')
    })
    await screen.findByText('Custom error')

    const toaster = document.querySelector('[data-sonner-toaster]')
    expect(toaster).toHaveClass('mailflow-toaster', 'application-toaster')
    expect(toaster).toHaveAttribute('data-x-position', 'center')
    expect(toaster).toHaveAttribute('data-y-position', 'top')
    expect(toaster).toHaveStyle('--mailflow-toast-error: purple')
  })
})
