import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox, Mail, Moon, Search, Send, Settings, Sun } from '../src/icons'

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    docs: {
      description: {
        component:
          'The shared MailFlow visual scales. Use the theme selector to inspect each palette.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const colors = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'warning',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
]

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {colors.map((color) => (
        <div key={color} className="overflow-hidden rounded-lg border border-border">
          <div className="h-16" style={{ background: `var(--${color})` }} />
          <div className="bg-card p-3 text-xs text-card-foreground">{color}</div>
        </div>
      ))}
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div className="grid gap-6">
      {['micro', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'].map(
        (size) => (
          <div key={size} className="min-w-0">
            <p className="text-xs text-muted-foreground">{size}</p>
            <p className="break-words" style={{ fontSize: `var(--font-size-${size})` }}>
              MailFlow
            </p>
          </div>
        ),
      )}
      <div className="flex flex-wrap gap-6">
        <span className="font-normal">Regular 400</span>
        <span className="font-medium">Medium 500</span>
        <span className="font-semibold">Semibold 600</span>
        <span className="font-bold">Bold 700</span>
      </div>
    </div>
  ),
}

export const Spacing: Story = {
  render: () => (
    <div className="grid gap-3">
      {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map((space) => (
        <div key={space} className="flex items-center gap-4">
          <span className="w-24 text-sm">
            {space} / {space * 4}px
          </span>
          <div className="h-4 bg-primary" style={{ width: `var(--space-${space})` }} />
        </div>
      ))}
    </div>
  ),
}

export const RadiiAndShadows: Story = {
  render: () => (
    <div className="grid gap-10">
      <div className="flex flex-wrap gap-6">
        {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map((size) => (
          <div
            key={size}
            className="grid size-24 place-items-center border border-border bg-card"
            style={{ borderRadius: `var(--radius-${size})` }}
          >
            {size}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-6">
        {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
          <div
            key={size}
            className="grid size-24 place-items-center rounded-lg bg-card"
            style={{ boxShadow: `var(--shadow-${size})` }}
          >
            {size}
          </div>
        ))}
      </div>
    </div>
  ),
}

export const Icons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      {[Mail, Inbox, Send, Search, Settings, Sun, Moon].map((Icon, index) => (
        <div
          key={['Mail', 'Inbox', 'Send', 'Search', 'Settings', 'Sun', 'Moon'][index]}
          className="grid justify-items-center gap-2 text-sm"
        >
          <Icon aria-hidden="true" className="size-6" strokeWidth={2} />
          <span>{['Mail', 'Inbox', 'Send', 'Search', 'Settings', 'Sun', 'Moon'][index]}</span>
        </div>
      ))}
    </div>
  ),
}
