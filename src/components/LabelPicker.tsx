import { Combobox } from '@base-ui/react/combobox'
import { useState } from 'react'
import { Check, ChevronDown, Plus, Search } from '../icons'
import { cn } from '../lib/utils'
import { Input } from './Input'

interface LabelPickerItem {
  id: string
  name: string
  color: string
}

interface LabelPickerResults {
  query: string
  items: readonly LabelPickerItem[]
  hasMore: boolean
  exactMatch: LabelPickerItem | null
}

interface LabelPickerProps {
  'aria-label': string
  className?: string
  value: LabelPickerItem | null
  onValueChange: (label: LabelPickerItem) => void
  query: string
  onQueryChange: (query: string) => void
  results: LabelPickerResults | null
  loadingMore: boolean
  onLoadMore: (query: string) => void
  onCreate: (name: string) => Promise<LabelPickerItem>
}

type PickerOption = LabelPickerItem | { create: string }

function LabelPicker({
  'aria-label': ariaLabel,
  className,
  value,
  onValueChange,
  query,
  onQueryChange,
  results,
  loadingMore,
  onLoadMore,
  onCreate,
}: LabelPickerProps) {
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [failedQuery, setFailedQuery] = useState<string | null>(null)
  const current = results?.query === query ? results : null
  const loadingCurrentPage = current !== null && loadingMore
  const name = query.trim()
  const canCreate = current && !current.exactMatch && name.length > 0 && name.length <= 100
  const labels = current?.items ?? []
  const items: readonly PickerOption[] =
    canCreate && !creating ? [{ create: name }, ...labels] : labels

  function loadMore() {
    if (current?.hasMore && !loadingMore && !creating) onLoadMore(query)
  }

  async function createLabel(labelName: string) {
    setCreating(true)
    setFailedQuery(null)
    let label: LabelPickerItem
    try {
      label = await onCreate(labelName)
    } catch {
      setFailedQuery(query)
      return
    } finally {
      setCreating(false)
    }
    onValueChange(label)
    onQueryChange('')
    setOpen(false)
  }

  const optionClassName =
    'flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground'

  return (
    <Combobox.Root<PickerOption>
      open={open}
      loopFocus={false}
      onItemHighlighted={(option, details) => {
        if (details.reason === 'keyboard' && option && option === labels.at(-1)) loadMore()
      }}
      onOpenChange={setOpen}
      value={value}
      readOnly={creating}
      inputValue={open ? query : query || value?.name || ''}
      onInputValueChange={(next, details) => {
        if (details.reason === 'input-change') {
          setFailedQuery(null)
          onQueryChange(next)
        }
      }}
      onValueChange={(option, details) => {
        if (!option) return
        if ('create' in option) {
          details.cancel()
          void createLabel(option.create)
          return
        }
        onValueChange(option)
        onQueryChange('')
      }}
      items={items}
      filteredItems={items}
      itemToStringLabel={(option) => ('create' in option ? option.create : option.name)}
      isItemEqualToValue={(item, selected) =>
        !('create' in item) && !('create' in selected) && item.id === selected.id
      }
    >
      <div className={cn('relative w-full', className)} data-slot="label-picker">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground"
        />
        <Combobox.Input
          aria-label={ariaLabel}
          placeholder="Search labels…"
          render={<Input className="pr-9 pl-9" />}
        />
        <Combobox.Trigger
          aria-label="Toggle labels"
          className="absolute inset-y-0 right-0 grid w-9 place-items-center rounded-r-md text-muted-foreground"
        >
          <ChevronDown aria-hidden="true" className="size-4" />
        </Combobox.Trigger>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="isolate z-50 w-(--anchor-width) min-w-36">
          <Combobox.Popup className="rounded-md border border-border bg-popover text-popover-foreground shadow-md">
            <Combobox.Empty className="px-3 py-2 text-sm text-muted-foreground empty:hidden">
              {current ? !creating && 'No labels found.' : 'Searching labels…'}
            </Combobox.Empty>
            <Combobox.List
              className="max-h-40 overflow-y-auto p-1"
              aria-busy={loadingCurrentPage}
              onScroll={(event) => {
                const { scrollHeight, clientHeight, scrollTop } = event.currentTarget
                if (scrollHeight - clientHeight - scrollTop <= 2) loadMore()
              }}
            >
              {(option: PickerOption) =>
                'create' in option ? (
                  <Combobox.Item
                    key="create"
                    value={option}
                    className={optionClassName}
                    aria-label={`Add ${option.create} +`}
                  >
                    <span className="min-w-0 flex-1 truncate">Add {option.create}</span>
                    <Plus aria-hidden="true" className="size-4 shrink-0" />
                  </Combobox.Item>
                ) : (
                  <Combobox.Item
                    key={`label-${option.id}`}
                    value={option}
                    className={optionClassName}
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="min-w-0 flex-1 truncate">{option.name}</span>
                    <Combobox.ItemIndicator>
                      <Check aria-hidden="true" className="size-4" />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )
              }
            </Combobox.List>
            {loadingCurrentPage && (
              <p role="status" className="px-3 py-2 text-sm">
                Loading more labels…
              </p>
            )}
            {creating && (
              <p role="status" className="px-3 py-2 text-sm">
                Adding label…
              </p>
            )}
            {failedQuery === query && (
              <p role="alert" className="px-3 py-2 text-sm text-destructive">
                Could not add label. Try again.
              </p>
            )}
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}

export type { LabelPickerItem, LabelPickerProps, LabelPickerResults }
export { LabelPicker }
