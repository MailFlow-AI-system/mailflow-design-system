// biome-ignore-all lint/performance/noDynamicNamespaceImportAccess: Contract tests intentionally compare public namespaces; this file is not shipped.
import * as Root from '@mailflow/ui'
import * as Components from '@mailflow/ui/components'
import * as Icons from '@mailflow/ui/icons'
import * as Lucide from 'lucide-react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

describe('workspace public contract', () => {
  it('makes the composed primitives available from both public entrypoints', () => {
    for (const name of [
      'Window',
      'WindowBody',
      'WindowClose',
      'WindowContent',
      'WindowDescription',
      'WindowHeader',
      'WindowMaximize',
      'WindowMinimize',
      'WindowMinimized',
      'WindowRestore',
      'WindowTitle',
      'WindowTrigger',
      'Toolbar',
      'ToolbarButton',
      'ToolbarSeparator',
      'AlertDialog',
      'AlertDialogClose',
      'AlertDialogContent',
      'AlertDialogDescription',
      'AlertDialogTitle',
      'AlertDialogTrigger',
    ] as const) {
      expect(Root[name]).toBe(Components[name])
    }
  })

  it('re-exports the exact Lucide drawings used by the reference and the new size controls', () => {
    for (const name of [
      'Bold',
      'Image',
      'Italic',
      'Languages',
      'Link2',
      'List',
      'ListOrdered',
      'Maximize2',
      'Minimize2',
      'Minus',
      'Save',
      'ScanText',
      'Smile',
      'SpellCheck',
      'SquarePen',
      'Underline',
    ] as const) {
      expect(Icons[name]).toBe(Lucide[name])
      expect(Root[name]).toBe(Lucide[name])
    }
  })

  it('can server-render the closed workspace without browser globals', () => {
    const html = renderToString(
      <Root.Window>
        <Root.WindowTrigger>Open workspace</Root.WindowTrigger>
        <Root.WindowContent>
          <Root.WindowTitle>Workspace</Root.WindowTitle>
          <Root.WindowClose>Close</Root.WindowClose>
        </Root.WindowContent>
        <Root.WindowMinimized aria-label="Minimized workspace">
          <Root.WindowRestore />
        </Root.WindowMinimized>
      </Root.Window>,
    )
    expect(html).toContain('Open workspace')
    expect(html).not.toContain('role="dialog"')
  })
})
