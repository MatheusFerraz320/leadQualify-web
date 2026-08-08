import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  Inbox,
  Loader2,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react'
import { cn, initials } from '../lib/utils'
import { useAuthStore } from '../stores/authStore'
import { useLeadsStore, type LeadStatus } from '../stores/leadsStore'
import { LeadCard } from '../components/leads/LeadCard'

const statusOptions: Array<{ value: LeadStatus | ''; label: string }> = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'APPROVED', label: 'Aprovados' },
  { value: 'REJECTED', label: 'Reprovados' },
]

export default function Leads() {
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
  const [status, setStatus] = useState<LeadStatus | ''>('')

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

  const selectedClient = clients?.find(
    (client) => client.userId === selectedClientId,
  )

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <Inbox className="h-5 w-5 text-white" strokeWidth={2} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            Leads
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe e qualifique os leads capturados
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {isAdmin && (
          <aside className="w-full shrink-0 lg:w-72">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 px-1">
                <Building2 className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Clientes
                </p>
              </div>

              <div className="space-y-1.5">
                {clientsLoading && clients === null ? (
                  <div className="flex items-center justify-center gap-2 py-6">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                    <span className="text-xs text-slate-500">
                      Carregando clientes...
                    </span>
                  </div>
                ) : clientsError && clients === null ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <p className="text-xs text-slate-500">{clientsError}</p>
                    <button
                      onClick={() => fetchClients()}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Tentar novamente
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => selectClient(null)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition',
                        selectedClientId === null
                          ? 'bg-indigo-50 font-semibold text-indigo-700 ring-1 ring-indigo-100'
                          : 'text-slate-600 hover:bg-slate-50',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                          selectedClientId === null
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        <Users className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium">
                        Todos os clientes
                      </span>
                    </button>

                    {clients?.map((client) => (
                      <button
                        key={client.userId}
                        onClick={() => selectClient(client.userId)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition',
                          selectedClientId === client.userId
                            ? 'bg-indigo-50 font-semibold text-indigo-700 ring-1 ring-indigo-100'
                            : 'text-slate-600 hover:bg-slate-50',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                            selectedClientId === client.userId
                              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                              : 'bg-slate-100 text-slate-500',
                          )}
                        >
                          {initials(client.user?.name ?? '')}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            {client.user?.name ?? 'Cliente'}
                          </span>
                          <span className="block truncate text-xs text-slate-400">
                            {client.total}{' '}
                            {client.total === 1 ? 'lead' : 'leads'}
                          </span>
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </aside>
        )}

        <section className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome ou e-mail"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                    status === option.value
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {selectedClient && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white">
                {initials(selectedClient.user?.name ?? '')}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {selectedClient.user?.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {selectedClient.user?.email}
                </p>
              </div>
            </div>
          )}

          {loading && leads === null ? (
            <div className="flex items-center justify-center gap-3 py-24">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              <span className="text-sm text-slate-500">
                Carregando leads...
              </span>
            </div>
          ) : error && leads === null ? (
            <div className="flex flex-col items-center gap-4 py-24">
              <p className="text-sm text-slate-500">{error}</p>
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
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Inbox className="h-6 w-6 text-slate-400" strokeWidth={1.75} />
              </span>
              <p className="text-sm font-medium text-slate-600">
                {query || status
                  ? 'Nenhum lead encontrado'
                  : 'Nenhum lead capturado ainda'}
              </p>
            </div>
          ) : (
            <>
              {leads && filteredLeads.length !== leads.length && (
                <p className="mb-3 text-xs text-slate-400">
                  Mostrando {filteredLeads.length} de {leads.length} leads
                </p>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
