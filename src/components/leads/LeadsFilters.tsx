import { Search } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'
import { useLeadsStore, type LeadStatus } from '../../stores/leadsStore'
import { ClientSelect } from './ClientSelect'

const statusOptions: Array<{ value: LeadStatus | ''; label: string }> = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'APPROVED', label: 'Aprovados' },
  { value: 'REJECTED', label: 'Reprovados' },
]

type LeadsFiltersProps = {
  showSearch?: boolean
  query: string
  onQueryChange: (value: string) => void
  status: LeadStatus | ''
  onStatusChange: (value: LeadStatus | '') => void
}

export function LeadsFilters({
  showSearch = true,
  query,
  onQueryChange,
  status,
  onStatusChange,
}: LeadsFiltersProps) {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ADMIN'

  const {
    clients,
    selectedClientId,
    clientsLoading,
    clientsError,
    fetchClients,
    selectClient,
  } = useLeadsStore()

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {isAdmin && (
        <ClientSelect
          clients={clients}
          selectedClientId={selectedClientId}
          loading={clientsLoading}
          error={clientsError}
          onSelect={selectClient}
          onRetry={fetchClients}
        />
      )}

      {showSearch && (
        <div className="relative w-full max-w-sm min-w-52 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar por nome ou e-mail"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              status === option.value
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
