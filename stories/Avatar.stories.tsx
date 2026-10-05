import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback, AvatarImage } from '../src/components/Avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback className="text-xs font-normal">AC</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {[
        { label: '24 px', sizeClassName: 'size-6', fallbackClassName: 'text-[10px] font-medium' },
        { label: '28 px', sizeClassName: 'size-7', fallbackClassName: 'text-[10px] font-normal' },
        { label: '36 px', sizeClassName: 'size-9', fallbackClassName: 'text-[11px] font-medium' },
        { label: '40 px', sizeClassName: 'size-10', fallbackClassName: 'text-xs font-normal' },
      ].map(({ label, sizeClassName, fallbackClassName }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <Avatar className={sizeClassName}>
            <AvatarFallback className={fallbackClassName}>AC</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&fit=crop&crop=faces"
        alt="Portrait of a person"
      />
      <AvatarFallback className="text-xs font-normal">JD</AvatarFallback>
    </Avatar>
  ),
}

export const MountedImageFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage keepMounted src="data:image/png;base64,broken" alt="Profile" />
      <AvatarFallback className="text-xs">JD</AvatarFallback>
    </Avatar>
  ),
}

export const FallbackExamples: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback className="text-xs font-normal">AC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-violet-100 text-[10px] font-normal text-violet-800 dark:bg-violet-500/20 dark:text-violet-300">
          JD
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-sky-100 text-[10px] font-normal text-sky-800 dark:bg-sky-500/20 dark:text-sky-300">
          MK
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-emerald-100 text-[10px] font-normal text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
          RS
        </AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const SidebarAndEmail: Story = {
  render: () => (
    <div className="flex flex-col gap-6 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback className="bg-primary/15 text-[color:color-mix(in_oklch,var(--primary)_90%,black)] dark:text-primary text-[10px] font-medium">
            AC
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs font-medium">Acme Corp</span>
          <span className="text-[10px] text-muted-foreground">Workspace</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="size-7">
          <AvatarFallback className="bg-violet-500/20 text-[10px] font-normal text-violet-700 dark:text-violet-300">
            JD
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs font-medium">Jordan Davis</span>
          <span className="text-[10px] text-muted-foreground">Account owner</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-blue-500/20 text-[11px] font-medium text-blue-700 dark:text-blue-300">
            JD
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">Jordan Davis</span>
            <span className="text-xs text-muted-foreground">jordan@example.com</span>
          </div>
          <span className="text-xs text-muted-foreground">Project update is ready to review</span>
        </div>
      </div>
    </div>
  ),
}
