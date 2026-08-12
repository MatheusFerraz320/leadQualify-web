export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function initials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  )
}

export type MonthGroup<T> = {
  key: string
  label: string
  items: T[]
}

export function groupByMonth<T extends { createdAt: string }>(
  items: T[],
): MonthGroup<T>[] {
  const groups = new Map<string, MonthGroup<T>>()

  for (const item of items) {
    const date = new Date(item.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    let group = groups.get(key)
    if (!group) {
      const label = date
        .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        .replace(/^./, (char) => char.toUpperCase())
      group = { key, label, items: [] }
      groups.set(key, group)
    }
    group.items.push(item)
  }

  return [...groups.values()].sort((a, b) => b.key.localeCompare(a.key))
}

export type MonthSummary = {
  key: string
  label: string
  total: number
  pending: number
  approved: number
  rejected: number
}

export function summarizeByMonth<T extends { createdAt: string; status: string }>(
  items: T[],
): MonthSummary[] {
  const groups = new Map<string, { label: string; total: number; pending: number; approved: number; rejected: number }>()

  for (const item of items) {
    const date = new Date(item.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    let group = groups.get(key)
    if (!group) {
      const label = date
        .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        .replace(/^./, (char) => char.toUpperCase())
      group = { label, total: 0, pending: 0, approved: 0, rejected: 0 }
      groups.set(key, group)
    }
    group.total += 1
    if (item.status === 'PENDING') group.pending += 1
    else if (item.status === 'APPROVED') group.approved += 1
    else if (item.status === 'REJECTED') group.rejected += 1
  }

  return [...groups.entries()]
    .map(([key, summary]) => ({ key, ...summary }))
    .sort((a, b) => b.key.localeCompare(a.key))
}
