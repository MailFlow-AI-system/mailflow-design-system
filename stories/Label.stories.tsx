import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../src/components/Label'

const meta = {
  title: 'Components/Label',
  component: Label,
  args: { children: 'Email address', htmlFor: 'example-email' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const AssociatedField: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label {...args} />
      <input
        id={args.htmlFor}
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <p className="text-xs text-muted-foreground">
        This native field demonstrates label association; Input is not a package component.
      </p>
    </div>
  ),
}
