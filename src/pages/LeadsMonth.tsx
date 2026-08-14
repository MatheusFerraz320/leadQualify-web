import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, CalendarDays, Inbox, Loader2, RefreshCw } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useLeadsStore, type LeadStatus } from '../stores/leadsStore'
import { LeadCard } from '../components/leads/LeadCard'
import { LeadsFilters } from '../components/leads/LeadsFilters'

function formatMonthLabel(month: string) {
  const [year, numericMonth] = month.split('-').map(Number)
  if (!year || !numericMonth) return month
  return new Date(year, numericMonth - 1, 1)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .replace(/^./, (char) => char.toUpperCase())
}

function monthKeyOf(iso: string) {
  const date = new Date(iso)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function LeadsMonth() {
  const { mes } = useParams<{ mes: string }>()
  const month = mes ?? ''
  const monthLabel = formatMonthLabel(month)

  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ADMIN'

  const {
    leads,
    clients,
    selectedClientId,
    loading,
    error,
    fetchLeads,
    fetchClients,
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

  const monthLeads = useMemo(
    () => (leads ?? []).filter((lead) => monthKeyOf(lead.createdAt) === month),
    [leads, month],
  )

  const filteredLeads = useMemo(() => {
    const term = query.trim().toLowerCase()
    return monthLeads.filter((lead) => {
      if (status && lead.status !== status) return false
      if (!term) return true
      return (
        lead.name.toLowerCase().includes(term) ||
        (lead.email ?? '').toLowerCase().includes(term)
      )
    })
  }, [monthLeads, status, query])

  return (
    <div className="mx-auto px-6 py-8">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Link
          to="/leads"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300"
          aria-label="Voltar para todos os meses"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </Link>

        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <CalendarDays className="h-5 w-5 text-white" strokeWidth={2} />
        </span>
        <div className="mr-auto">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 capitalize dark:text-slate-100">
            {monthLabel}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Leads capturados no mês
          </p>
        </div>
      </div>

      <section className="min-w-0">
        <LeadsFilters
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
        />

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
              onClick={() =>
                fetchLeads(isAdmin ? (selectedClientId ?? undefined) : undefined)
              }
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/60">
              <Inbox
                className="h-6 w-6 text-slate-400 dark:text-slate-500"
                strokeWidth={1.75}
              />
            </span>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {monthLeads.length === 0 && !query && !status
                ? 'Nenhum lead capturado neste mês'
                : 'Nenhum lead encontrado'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
