import {
  Badge,
  LabelPicker,
  type LabelPickerItem,
  type LabelPickerResults,
} from '@mailflow/ui/components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, useState } from 'react'

const pageSize = 5
const colors = ['#7c3aed', '#2563eb', '#0f766e', '#b45309', '#be185d']
const names = [
  'Work',
  'Urgent',
  'Finance',
  'Marketing',
  'Product',
  'Design',
  'Client',
  'Internal',
  'Newsletter',
  'Travel',
  'Support',
  'Security',
  'Finance Operations',
  'Invoices',
]

const initialLabels: LabelPickerItem[] = names.map((name, index) => ({
  id: String(index + 1),
  name,
  color: colors[index % colors.length] ?? '#7c3aed',
}))

function findLabels(labels: LabelPickerItem[], query: string, limit: number): LabelPickerResults {
  const term = query.trim().toLowerCase()
  const matches = labels.filter((label) => label.name.toLowerCase().includes(term))
  return {
    query,
    items: matches.slice(0, limit),
    hasMore: matches.length > limit,
    exactMatch: matches.find((label) => label.name.toLowerCase() === term) ?? null,
  }
}

function LabelPickerDemo({ failFirstCreate }: { failFirstCreate: boolean }) {
  const [labels, setLabels] = useState(initialLabels)
  const [value, setValue] = useState<LabelPickerItem | null>(null)
  const [request, setRequest] = useState({ query: '', limit: pageSize })
  const [results, setResults] = useState<LabelPickerResults | null>(() =>
    findLabels(initialLabels, '', pageSize),
  )
  const shouldFail = useRef(failFirstCreate)
  const loadingMore =
    results?.query === request.query && results.hasMore && results.items.length < request.limit

  useEffect(() => {
    const timer = window.setTimeout(
      () => setResults(findLabels(labels, request.query, request.limit)),
      220,
    )
    return () => window.clearTimeout(timer)
  }, [labels, request])

  async function createLabel(name: string) {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 350))
    if (shouldFail.current) {
      shouldFail.current = false
      throw new Error('The demo request failed.')
    }
    const label = { id: crypto.randomUUID(), name, color: '#7c3aed' }
    setLabels((previous) => [...previous, label])
    return label
  }

  return (
    <div className="w-72 space-y-3">
      <LabelPicker
        aria-label="Email label"
        value={value}
        onValueChange={setValue}
        query={request.query}
        onQueryChange={(query) => {
          setResults(null)
          setRequest({ query, limit: pageSize })
        }}
        results={results}
        loadingMore={loadingMore}
        onLoadMore={(query) => {
          setRequest((previous) =>
            previous.query === query && previous.limit === request.limit
              ? { query, limit: previous.limit + pageSize }
              : previous,
          )
        }}
        onCreate={createLabel}
      />
      <p className="text-sm text-muted-foreground">
        Selected label {value ? <Badge variant="secondary">{value.name}</Badge> : 'None'}
      </p>
    </div>
  )
}

const meta = {
  title: 'Components/LabelPicker',
  component: LabelPicker,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof LabelPicker>

export default meta

type Story = StoryObj

export const Paginated: Story = {
  render: () => <LabelPickerDemo failFirstCreate={false} />,
}

export const RetryCreation: Story = {
  render: () => <LabelPickerDemo failFirstCreate />,
}
