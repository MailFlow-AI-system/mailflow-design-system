import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Toaster, toast } from '../src/components'

const meta = { title: 'Components/Toaster', component: Toaster } satisfies Meta<typeof Toaster>
export default meta
type Story = StoryObj<typeof meta>

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button
        type="button"
        onClick={() => toast('Draft saved', { description: 'Your work is ready.' })}
      >
        Default
      </Button>
      <Button type="button" onClick={() => toast.success('Message sent')}>
        Success
      </Button>
      <Button type="button" onClick={() => toast.info('Sync in progress')}>
        Info
      </Button>
      <Button type="button" onClick={() => toast.warning('Storage almost full')}>
        Warning
      </Button>
      <Button type="button" onClick={() => toast.error('Unable to send message')}>
        Error
      </Button>
      <Button type="button" onClick={() => toast.loading('Preparing message')}>
        Loading
      </Button>
    </div>
  ),
}

export const Customized: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toaster
        position="top-center"
        closeButton
        className="custom-toast-preview"
        style={{ '--mailflow-toast-success': 'rebeccapurple' } as React.CSSProperties}
        toastOptions={{ duration: 8000 }}
      />
      <Button
        type="button"
        onClick={() =>
          toast.success('Custom presentation', {
            description: 'Applications can change position, colors, duration, actions and content.',
          })
        }
      >
        Show customized toast
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          toast.custom((id) => (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-lg">
              <span>Entirely custom content</span>
              <Button type="button" size="sm" onClick={() => toast.dismiss(id)}>
                Dismiss
              </Button>
            </div>
          ))
        }
      >
        Show custom content
      </Button>
    </div>
  ),
}
