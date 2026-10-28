import { Checkbox } from '@mailflow/ui'
import { Checkbox as ComponentCheckbox } from '@mailflow/ui/components'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

describe('checkbox public contract', () => {
  it('exposes the same component from both public entrypoints', () => {
    expect(Checkbox).toBeDefined()
    expect(Checkbox).toBe(ComponentCheckbox)
  })

  it('server-renders the accessible checked and mixed states', () => {
    const html = renderToString(
      <>
        <Checkbox aria-label="Select message" defaultChecked />
        <Checkbox aria-label="Select all" indeterminate />
      </>,
    )

    expect(html).toContain('role="checkbox"')
    expect(html).toContain('aria-checked="true"')
    expect(html).toContain('aria-checked="mixed"')
    expect(html).toContain('aria-label="Select message"')
    expect(html).toContain('aria-label="Select all"')
  })
})
