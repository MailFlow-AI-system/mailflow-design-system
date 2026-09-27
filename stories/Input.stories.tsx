import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../src/components/Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { type: 'email', placeholder: 'you@example.com' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="input-email">Email address</label>
      <Input id="input-email" {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  ...Playground,
  args: { ...meta.args, disabled: true },
}

export const Invalid: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="input-invalid-email">Email address</label>
      <Input
        id="input-invalid-email"
        aria-invalid="true"
        aria-describedby="input-error"
        {...args}
      />
      <p id="input-error" className="text-sm text-destructive">
        Enter a valid email address.
      </p>
    </div>
  ),
}
