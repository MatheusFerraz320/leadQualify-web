import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  CalendarDays,
  ChevronDown,
  Inbox,
  Loader2,
  RefreshCw,
  Search,
} from 'lucide-react'
import { cn, groupByMonth } from '../lib/utils'
import { useAuthStore } from '../stores/authStore'
import { useLeadsStore, type LeadStatus } from '../stores/leadsStore'
import { LeadCard } from '../components/leads/LeadCard'
import { ClientSelect } from '../components/leads/ClientSelect'

const statusOptions: Array<{ value: LeadStatus | ''; label: string }> = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'APPROVED', label: 'Aprovados' },
  { value: 'REJECTED', label: 'Reprovados' },
]

const leadStatusValues: LeadStatus[] = ['PENDING', 'APPROVED', 'REJECTED']

export default function Leads() {
  const [searchParams] = useSearchParams()
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ADMIN'

  const {
    leads,
    clients,
    selectedClientId,
    loading,
    error,
    clientsLoading,
    clientsError,
    fetchLeads,
    fetchClients,
    selectClient,
  } = useLeadsStore()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<LeadStatus | ''>(
    () =>
      (leadStatusValues as string[]).includes(searchParams.get('status') ?? '')
        ? (searchParams.get('status') as LeadStatus)
        : '',
  )
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(
    () => new Set(),
  )

  useEffect(() => {
    const param = searchParams.get('status')
    setStatus(
      (leadStatusValues as string[]).includes(param ?? '')
        ? (param as LeadStatus)
        : '',
    )
  }, [searchParams])

  const toggleMonth = (key: string) =>
    setCollapsedMonths((previous) => {
      const next = new Set(previous)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })

  useEffect(() => {
    if (isAdmin && clients === null) {
      fetchClients()
    }
  }, [isAdmin, clients, fetchClients])

  useEffect(() => {
    fetchLeads(isAdmin ? (selectedClientId ?? undefined) : undefined)
  }, [isAdmin, selectedClientId, fetchLeads])

  const filteredLeads = useMemo(() => {
    if (!leads) return []
    const term = query.trim().toLowerCase()
    return leads.filter((lead) => {
      if (status && lead.status !== status) return false
      if (!term) return true
      return (
        lead.name.toLowerCase().includes(term) ||
        (lead.email ?? '').toLowerCase().includes(term)
      )
    })
  }, [leads, query, status])

  const monthGroups = useMemo(
    () => groupByMonth(filteredLeads),
    [filteredLeads],
  )

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <Inbox className="h-5 w-5 text-white" strokeWidth={2} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Leads
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Acompanhe e qualifique os leads capturados
          </p>
        </div>
      </div>

      <section className="min-w-0">
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

          <div className="relative w-full max-w-sm min-w-52 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome ou e-mail"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatus(option.value)}
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

        <div className="min-w-0">
          {loading && leads === null ? (
            <div className="flex items-center justify-center gap-3 py-24">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Carregando leads...
              </span>
            </div>
          ) : error && leads === null ? (
            <div className="flex flex-col items-center gap-4 py-24">
              <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
              <button
                onClick={() => fetchLeads(isAdmin ? (selectedClientId ?? undefined) : undefined)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/60">
                <Inbox className="h-6 w-6 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
              </span>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {query || status
                  ? 'Nenhum lead encontrado'
                  : 'Nenhum lead capturado ainda'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {monthGroups.map((group) => {
                const collapsed = collapsedMonths.has(group.key)
                return (
                  <section key={group.key} className="min-w-0">
                    <button
                      onClick={() => toggleMonth(group.key)}
                      aria-expanded={!collapsed}
                      className="group mb-3 flex w-full items-center gap-2.5 rounded-xl px-1 py-1 text-left"
                    >
                      <CalendarDays
                        className="h-4.5 w-4.5 shrink-0 text-indigo-500 dark:text-indigo-400"
                        strokeWidth={1.75}
                      />
                      <h2 className="font-display text-lg font-semibold tracking-tight text-slate-900 capitalize dark:text-slate-100">
                        {group.label}
                      </h2>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {group.items.length}{' '}
                        {group.items.length === 1 ? 'lead' : 'leads'}
                      </span>
                      <span className="h-px min-w-4 flex-1 bg-slate-200 dark:bg-slate-800" />
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500',
                          collapsed ? '-rotate-90' : 'rotate-0',
                        )}
                        strokeWidth={1.75}
                      />
                    </button>

                    <div
                      className={cn(
                        'grid transition-all duration-300 ease-in-out',
                        collapsed
                          ? 'grid-rows-[0fr] opacity-0'
                          : 'grid-rows-[1fr] opacity-100',
                      )}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="grid grid-cols-1 gap-4 pt-1 pb-2 md:grid-cols-2 xl:grid-cols-3">
                          {group.items.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )
              })}
              </div>
          )}
        </div>
      </section>
    </div>
  )
}
