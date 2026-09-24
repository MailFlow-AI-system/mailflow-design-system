import { describe, expect, it } from 'vitest'
import { mergeClassName } from '../src/lib/utils'

describe('mergeClassName', () => {
  it('merges static class names with Tailwind conflicts', () => {
    expect(mergeClassName('px-2 text-sm', 'px-4')).toBe('text-sm px-4')
  })

  it('merges state-derived class names after evaluating the callback', () => {
    const className = mergeClassName('px-2 text-sm', (state: { open: boolean }) =>
      state.open ? 'px-4 text-lg' : 'px-3',
    )

    expect(typeof className).toBe('function')

    if (typeof className !== 'function') {
      throw new Error('Expected mergeClassName to preserve a state callback')
    }

    expect(className({ open: true })).toBe('px-4 text-lg')
    expect(className({ open: false })).toBe('text-sm px-3')
  })
})
