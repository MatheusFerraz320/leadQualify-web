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
