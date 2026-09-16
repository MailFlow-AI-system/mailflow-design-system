import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../src/components/Button'
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider'

const meta = {
  title: 'Foundations/Theme',
  parameters: {
    docs: {
      description: {
        component:
          'Dark is the default. Light, dark, and system preferences persist under mailflow-theme. The synchronous head script applies the palette before paint; useSyncExternalStore keeps independent providers synchronized without useEffect.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function ThemeExample() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <div className="grid gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground">
      <p className="text-sm">
        Preference: {theme}. Resolved palette: {resolvedTheme}.
      </p>
      <div className="flex flex-wrap gap-2">
        {(['light', 'dark', 'system'] as const).map((value) => (
          <Button
            key={value}
            variant={theme === value ? 'default' : 'outline'}
            aria-pressed={theme === value}
            onClick={() => setTheme(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  )
}

export const SharedPreference: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <ThemeProvider>
        <ThemeExample />
      </ThemeProvider>
      <ThemeProvider>
        <ThemeExample />
      </ThemeProvider>
    </div>
  ),
}
