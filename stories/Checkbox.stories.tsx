import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Avatar, AvatarFallback } from '../src/components/Avatar'
import { Checkbox } from '../src/components/Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { 'aria-label': 'Select message', disabled: false, indeterminate: false },
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2 text-sm">
        <Checkbox id="checkbox-unchecked" />
        <label htmlFor="checkbox-unchecked">Unchecked</label>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Checkbox id="checkbox-checked" defaultChecked />
        <label htmlFor="checkbox-checked">Checked</label>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Checkbox id="checkbox-indeterminate" indeterminate />
        <label htmlFor="checkbox-indeterminate">Indeterminate</label>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Checkbox id="checkbox-disabled" disabled />
        <label htmlFor="checkbox-disabled">Disabled</label>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Checkbox id="checkbox-disabled-checked" disabled defaultChecked />
        <label htmlFor="checkbox-disabled-checked">Disabled checked</label>
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm">
      <Checkbox id="checkbox-remember-device" />
      <label htmlFor="checkbox-remember-device">Remember this device</label>
    </div>
  ),
}

const messages = [
  { id: 'ada', sender: 'Ada Lovelace', subject: 'Analytical Engine notes', initials: 'AL' },
  { id: 'grace', sender: 'Grace Hopper', subject: 'Compiler release plan', initials: 'GH' },
  { id: 'alan', sender: 'Alan Turing', subject: 'Machine intelligence draft', initials: 'AT' },
]

export const ListRowSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['grace'])
    const all = selected.length === messages.length
    const some = selected.length > 0 && !all

    return (
      <section aria-label="Message list" className="w-96 rounded-lg border">
        <div className="flex items-center gap-3 border-b px-3 py-2">
          <Checkbox
            aria-label="Select all messages"
            checked={all}
            indeterminate={some}
            onCheckedChange={(checked) => setSelected(checked ? messages.map(({ id }) => id) : [])}
          />
          <span className="text-xs text-muted-foreground" role="status">
            {selected.length === 0 ? 'Select all' : `${selected.length} selected`}
          </span>
        </div>
        <ul className="m-0 list-none p-0">
          {messages.map(({ id, sender, subject, initials }) => {
            const checked = selected.includes(id)
            return (
              <li
                key={id}
                className={`flex items-start gap-3 border-b px-3 py-3 last:border-b-0 ${checked ? 'bg-primary/10' : 'hover:bg-muted/40'}`}
              >
                <Checkbox
                  aria-label={`Select message from ${sender}: ${subject}`}
                  checked={checked}
                  onCheckedChange={(next) =>
                    setSelected((current) =>
                      next ? [...current, id] : current.filter((item) => item !== id),
                    )
                  }
                />
                <Avatar aria-hidden="true" className="size-9">
                  <AvatarFallback className="bg-primary/15 text-[11px] font-medium text-violet-700 dark:text-violet-300">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{sender}</p>
                  <p className="truncate text-xs text-muted-foreground">{subject}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    )
  },
}
