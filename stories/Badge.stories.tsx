import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../src/components/Badge'
import { ArrowRight, CheckCircle2 } from '../src/icons'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Badge', variant: 'default' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(['default', 'secondary', 'destructive', 'outline'] as const).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

export const EmailLabels: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-6 rounded-lg border p-5">
      <section aria-label="Email list row" className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          Quarterly product update
        </span>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-normal">
            Product
          </Badge>
          <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-normal">
            Updates
          </Badge>
        </div>
      </section>
      <section aria-label="Email reader labels" className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Your workspace is ready</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            Inbox
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            Onboarding
          </Badge>
        </div>
      </section>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Badge variant="secondary">
      <CheckCircle2 data-icon="inline-start" aria-hidden="true" />
      Verified
    </Badge>
  ),
}

export const AsLink: Story = {
  render: () => (
    <Badge render={<a href="#inbox" />} variant="outline">
      Open inbox <ArrowRight data-icon="inline-end" aria-hidden="true" />
    </Badge>
  ),
}
