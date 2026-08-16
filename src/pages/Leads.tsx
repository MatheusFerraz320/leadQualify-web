import { useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Hourglass,
  Inbox,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import { summarizeByMonth } from '../lib/utils'
import { useAuthStore } from '../stores/authStore'
import { useLeadsStore } from '../stores/leadsStore'
import { ClientSelect } from '../components/leads/ClientSelect'
import { BrandedLoader } from '../components/layout/BrandedLoader'

const statusChips: Array<{
  key: 'pending' | 'approved' | 'rejected'
  label: string
  icon: typeof Hourglass
  classes: string
}> = [
  {
    key: 'pending',
    label: 'Pendentes',
    icon: Hourglass,
    classes: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'approved',
    label: 'Aprovados',
    icon: CheckCircle2,
    classes: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'rejected',
    label: 'Reprovados',
    icon: XCircle,
    classes: 'text-rose-600 dark:text-rose-400',
  },
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

  useEffect(() => {
    if (isAdmin && clients === null) {
      fetchClients()
    }
  }, [isAdmin, clients, fetchClients])

  useEffect(() => {
    fetchLeads(isAdmin ? (selectedClientId ?? undefined) : undefined)
  }, [isAdmin, selectedClientId, fetchLeads])

  const monthSummaries = useMemo(() => summarizeByMonth(leads ?? []), [leads])

  return (
    <div className="mx-auto px-6 py-8">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <Inbox className="h-5 w-5 text-white" strokeWidth={2} />
        </span>
        <div className="mr-auto">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Leads
          </h1>
          <p className="text-sm text-slate-500 dark:text-white">
            Acompanhe e qualifique os leads capturados
          </p>
        </div>

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
      </div>

      <section className="min-w-0">
        {loading && leads === null ? (
          <BrandedLoader label="Carregando leads..." />
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
        ) : monthSummaries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/60">
              <Inbox
                className="h-6 w-6 text-slate-400 dark:text-slate-500"
                strokeWidth={1.75}
              />
            </span>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Nenhum lead capturado ainda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {monthSummaries.map((summary) => (
              <Link
                key={summary.key}
                to={`/leads/${summary.key}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-indigo-500/40 dark:hover:shadow-black/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-lg font-semibold tracking-tight text-slate-900 capitalize dark:text-slate-100">
                      {summary.label}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Leads capturados
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:scale-105 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <CalendarDays className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                </div>

                <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  {summary.total}{' '}
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                    {summary.total === 1 ? 'lead' : 'leads'}
                  </span>
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {statusChips.map((chip) => {
                    const Icon = chip.icon
                    return (
                      <div
                        key={chip.key}
                        className="rounded-xl bg-slate-50 px-2 py-2 text-center dark:bg-slate-800/60"
                      >
                        <Icon className={`mx-auto h-4 w-4 ${chip.classes}`} strokeWidth={1.75} />
                        <p
                          className={`mt-1 font-display text-base font-semibold ${chip.classes}`}
                        >
                          {summary[chip.key]}
                        </p>
                        <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                          {chip.label}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Ver leads
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
