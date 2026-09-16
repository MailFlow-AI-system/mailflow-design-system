import type { Preview } from '@storybook/react-vite'
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider'
import './preview.css'

function ThemeControls() {
  const { theme, setTheme } = useTheme()

  return (
    <label className="mb-8 flex items-center gap-3 text-sm">
      Theme
      <select
        aria-label="Preview theme"
        value={theme}
        onChange={(event) => {
          const value = event.currentTarget.value
          if (value === 'light' || value === 'dark' || value === 'system') setTheme(value)
        }}
        className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="system">System</option>
      </select>
    </label>
  )
}

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    a11y: { test: 'error' },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="min-h-screen bg-background p-4 text-foreground">
          <ThemeControls />
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default preview
