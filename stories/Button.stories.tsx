import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../src/components/Button'
import { ArrowRight, Plus } from '../src/icons'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Continue', variant: 'default', size: 'default', disabled: false },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'select', options: ['sm', 'default', 'lg', 'icon'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map(
        (variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ),
      )}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Create message">
        <Plus aria-hidden="true" />
      </Button>
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, children: 'Unavailable' } }

export const WithIcon: Story = {
  render: () => (
    <Button>
      Continue <ArrowRight aria-hidden="true" />
    </Button>
  ),
}

export const RenderAsLink: Story = {
  render: () => (
    <Button nativeButton={false} render={<a href="#component-example" />} variant="outline">
      Open example <ArrowRight aria-hidden="true" />
    </Button>
  ),
}
