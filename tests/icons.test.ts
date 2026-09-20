import { ChartColumn, Globe, Megaphone, Play, Shield, Star, Workflow } from '@mailflow/ui/icons'
import { describe, expect, it } from 'vitest'

describe('icons', () => {
  it('exports the landing-page Lucide set', () => {
    const icons = [ChartColumn, Globe, Megaphone, Play, Shield, Star, Workflow]

    for (const icon of icons) {
      expect(icon).toHaveProperty('$$typeof')
      expect(icon).toHaveProperty('displayName')
    }
  })
})
