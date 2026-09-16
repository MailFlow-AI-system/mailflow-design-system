import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'
import { themeScript } from '../src/theme/themeScript.ts'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  docs: { autodocs: 'tag' },
  previewHead: (head) => `${head}<script>${themeScript}</script>`,
  async viteFinal(config) {
    return mergeConfig(config, { plugins: [tailwindcss()] })
  },
}

export default config
