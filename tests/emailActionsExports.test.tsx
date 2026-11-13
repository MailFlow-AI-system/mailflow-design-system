import { Empty, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@mailflow/ui'
import { Empty as ComponentEmpty, Tooltip as ComponentTooltip } from '@mailflow/ui/components'
import { Archive, ArchiveRestore, MailOpen, RotateCcw, StarOff } from '@mailflow/ui/icons'
import { describe, expect, it } from 'vitest'

describe('email actions public contract', () => {
  it('exposes the same components from both public entrypoints', () => {
    expect(TooltipProvider).toBeDefined()
    expect(TooltipTrigger).toBeDefined()
    expect(TooltipContent).toBeDefined()
    expect(Tooltip).toBe(ComponentTooltip)
    expect(Empty).toBe(ComponentEmpty)
  })

  it('exports the icons used by message actions', () => {
    for (const icon of [Archive, ArchiveRestore, MailOpen, RotateCcw, StarOff]) {
      expect(icon).toHaveProperty('$$typeof')
      expect(icon).toHaveProperty('displayName')
    }
  })
})
