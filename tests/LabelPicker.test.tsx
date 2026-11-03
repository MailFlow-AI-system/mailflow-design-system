import { LabelPicker, type LabelPickerProps } from '@mailflow/ui/components'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

const labels = ['Finance', 'Marketing', 'Product', 'Design', 'Travel', 'Support'].map((name) => ({
  id: name.toLowerCase(),
  name,
  color: '#7628c9',
}))

function setup(overrides: Partial<LabelPickerProps> = {}) {
  const onValueChange = vi.fn()
  const onLoadMore = vi.fn()
  const onCreate = vi.fn<LabelPickerProps['onCreate']>()
  const props = {
    'aria-label': 'Label',
    onValueChange,
    onLoadMore,
    onCreate,
    ...overrides,
  }

  function Controlled({
    results,
    loadingMore = false,
  }: Pick<LabelPickerProps, 'results'> & { loadingMore?: boolean | undefined }) {
    const [query, setQuery] = useState('')
    return (
      <LabelPicker
        {...props}
        value={null}
        query={query}
        onQueryChange={setQuery}
        results={results}
        loadingMore={loadingMore}
      />
    )
  }

  const results = { query: '', items: labels.slice(0, 5), hasMore: true, exactMatch: null }
  const view = render(<Controlled results={results} />)
  return {
    ...view,
    input: screen.getByRole('combobox', { name: 'Label' }),
    user: userEvent.setup(),
    onValueChange,
    onLoadMore,
    onCreate,
    results,
    update: (next: LabelPickerProps['results'], loadingMore?: boolean) =>
      view.rerender(<Controlled results={next} loadingMore={loadingMore} />),
  }
}

describe('LabelPicker', () => {
  it('opens with the first page and selects an existing label', async () => {
    const { input, user, onValueChange } = setup()
    await user.click(input)
    expect(screen.getAllByRole('option')).toHaveLength(5)
    await user.click(screen.getByRole('option', { name: 'Design' }))
    expect(onValueChange).toHaveBeenCalledWith(labels[3])
  })
  it('offers creation only for a confirmed query, and selects the persisted label after retry', async () => {
    const { input, user, onCreate, onValueChange, update } = setup()
    const persisted = { id: 'persisted', name: 'Fin', color: '#7628c9' }
    onCreate.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(persisted)

    await user.type(input, 'Fin')
    expect(screen.queryByRole('option', { name: 'Finance' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Add Fin +' })).not.toBeInTheDocument()

    const result = { query: 'Fin', items: [labels[0]], hasMore: true, exactMatch: null }
    update({ ...result, exactMatch: persisted })
    expect(screen.getByRole('option', { name: 'Finance' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Add Fin +' })).not.toBeInTheDocument()

    update(result)
    await user.click(screen.getByRole('option', { name: 'Add Fin +' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not add label')
    expect(input).toHaveValue('Fin')
    expect(onValueChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole('option', { name: 'Add Fin +' }))
    expect(onCreate.mock.calls).toEqual([['Fin'], ['Fin']])
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(persisted)
  })
  it('hides late pages and creation eligibility from an earlier query', async () => {
    const { input, user, update } = setup()
    await user.type(input, 'Fin')
    const financeResults = { query: 'Fin', items: [labels[0]], exactMatch: null, hasMore: true }
    update(financeResults)
    expect(screen.getByRole('option', { name: 'Add Fin +' })).toBeInTheDocument()

    await user.clear(input)
    await user.type(input, 'Supp')
    update({ ...financeResults, items: labels.slice(0, 3) }, true)

    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(screen.getByText('Searching labels…')).toBeInTheDocument()
    expect(screen.queryByText('Loading more labels…')).not.toBeInTheDocument()

    update({ query: 'Supp', items: [labels[5]], exactMatch: null, hasMore: false })
    expect(screen.getByRole('option', { name: 'Support' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Add Supp +' })).toBeInTheDocument()
  })

  it('requests the next page near the scroll boundary and keeps existing rows', async () => {
    const { input, user, onLoadMore, results, update } = setup()
    await user.click(input)
    const list = screen.getByRole('listbox')
    Object.defineProperties(list, {
      clientHeight: { value: 160 },
      scrollHeight: { value: 200 },
    })
    fireEvent.scroll(list, { target: { scrollTop: 10 } })
    expect(onLoadMore).not.toHaveBeenCalled()
    fireEvent.scroll(list, { target: { scrollTop: 40 } })
    expect(onLoadMore).toHaveBeenCalledExactlyOnceWith('')

    update(results, true)
    fireEvent.scroll(list)
    expect(onLoadMore).toHaveBeenCalledTimes(1)
    update({ ...results, items: labels, hasMore: false })
    expect(screen.getAllByRole('option')).toHaveLength(6)
    fireEvent.scroll(list)
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('requests another page when keyboard navigation reaches the last loaded label', async () => {
    const { input, user, onLoadMore, onValueChange, results, update } = setup()
    await user.click(input)
    await user.keyboard('{ArrowDown>5/}')
    expect(onLoadMore).toHaveBeenCalledExactlyOnceWith('')
    update({ ...results, items: labels, hasMore: false })
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(labels[5])
  })

  it('does not offer creation for whitespace or a name over 100 characters', async () => {
    const { input, user, update } = setup()
    await user.click(input)
    for (const query of ['   ', 'a'.repeat(101)]) {
      fireEvent.change(input, { target: { value: query } })
      update({ query, items: [], exactMatch: null, hasMore: false })
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
    }
  })
})
