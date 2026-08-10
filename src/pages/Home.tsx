import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Hourglass,
  Inbox,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { cn, initials } from '../lib/utils'
import { useAuthStore } from '../stores/authStore'
import {
  useDashboardStore,
  type LabelCount,
  type MonthlyPoint,
} from '../stores/dashboardStore'
import { useLeadsStore, type LeadStatus } from '../stores/leadsStore'
import { ClientSelect } from '../components/leads/ClientSelect'

const statusMeta: Record<LeadStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  APPROVED: {
    label: 'Aprovados',
    color: '#10b981',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    icon: CheckCircle2,
  },
  PENDING: {
    label: 'Pendentes',
    color: '#f59e0b',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    icon: Hourglass,
  },
  REJECTED: {
    label: 'Reprovados',
    color: '#f43f5e',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    icon: XCircle,
  },
}

const shortMonths = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

function formatMonthKey(key: string) {
  const [year, month] = key.split('-')
  const label = shortMonths[Number(month) - 1] ?? month
  return `${label}/${year.slice(2)}`
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

type KpiCardProps = {
  label: string
  value: string
  icon: typeof Inbox
  accent: string
  delta?: number
  deltaLabel?: string
}

function KpiCard({ label, value, icon: Icon, accent, delta, deltaLabel }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-indigo-100/60 blur-2xl dark:bg-indigo-500/10',
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </p>
        </div>
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
            accent,
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </div>
      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-semibold',
              delta > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : delta < 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-500 dark:text-slate-400',
            )}
          >
            {delta > 0 ? (
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            ) : delta < 0 ? (
              <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2} />
            ) : null}
            {delta > 0 ? '+' : ''}
            {delta}%
          </span>
          <span className="text-slate-400 dark:text-slate-500">
            {deltaLabel ?? 'vs mês anterior'}
          </span>
        </div>
      )}
    </div>
  )
}

type PanelProps = {
  title: string
  subtitle?: string
  className?: string
  children: React.ReactNode
}

function Panel({ title, subtitle, className, children }: PanelProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="font-display text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  )
}

function EmptyChart() {
  return (
    <div className="flex h-56 flex-col items-center justify-center gap-2 text-center">
      <Inbox className="h-6 w-6 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
      <p className="text-xs text-slate-400 dark:text-slate-500">Sem dados ainda</p>
    </div>
  )
}

export default function Home() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ADMIN'

  const { summary, loading, error, fetchSummary } = useDashboardStore()
  const {
    clients,
    clientsLoading,
    clientsError,
    fetchClients,
  } = useLeadsStore()

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  useEffect(() => {
    if (isAdmin && clients === null) {
      fetchClients()
    }
  }, [isAdmin, clients, fetchClients])

  useEffect(() => {
    fetchSummary(isAdmin ? (selectedClientId ?? undefined) : undefined)
  }, [isAdmin, selectedClientId, fetchSummary])

  const totals = summary?.totals

  const monthlyAsc = useMemo<Array<MonthlyPoint & { label: string }>>(() => {
    if (!summary?.monthly.length) return []
    return [...summary.monthly]
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((point) => ({ ...point, label: formatMonthKey(point.month) }))
  }, [summary?.monthly])

  const statusData = useMemo(
    () =>
      (summary?.byStatus ?? []).map((s) => ({
        name: statusMeta[s.status].label,
        value: s.count,
        color: statusMeta[s.status].color,
      })),
    [summary?.byStatus],
  )

  const emptyLabel = (items: LabelCount[]) =>
    items.every((item) => item.label === '—')

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <LayoutDashboard className="h-5 w-5 text-white" strokeWidth={2} />
        </span>
        <div className="mr-auto">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAdmin ? 'Métricas gerais de todos colaboradores' : 'Visão geral'}
          </p>
        </div>

        {isAdmin && (
          <ClientSelect
            clients={clients}
            selectedClientId={selectedClientId}
            loading={clientsLoading}
            error={clientsError}
            onSelect={setSelectedClientId}
            onRetry={fetchClients}
          />
        )}
      </div>

      {loading && summary === null ? (
        <div className="flex items-center justify-center gap-3 py-24">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Carregando métricas...
          </span>
        </div>
      ) : error && summary === null ? (
        <div className="flex flex-col items-center gap-4 py-24">
          <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
          <button
            onClick={() =>
              fetchSummary(isAdmin ? (selectedClientId ?? undefined) : undefined)
            }
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      ) : !totals ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/60">
            <Inbox className="h-6 w-6 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          </span>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Nenhuma métrica disponível ainda
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard
              label="Total de leads"
              value={String(totals.total)}
              icon={Inbox}
              accent="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
            />
            <KpiCard
              label="Novos no mês"
              value={String(totals.newThisMonth)}
              icon={TrendingUp}
              accent="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
              delta={totals.monthDeltaPct}
            />
            <KpiCard
              label="Pendentes"
              value={String(totals.pending)}
              icon={Hourglass}
              accent="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"
            />
            <KpiCard
              label="Aprovados"
              value={String(totals.approved)}
              icon={CheckCircle2}
              accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
            />
            <KpiCard
              label="Reprovados"
              value={String(totals.rejected)}
              icon={XCircle}
              accent="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
            />
            <KpiCard
              label="Conversão"
              value={formatPercent(totals.conversionRate)}
              icon={Target}
              accent="bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel title="Leads por status" subtitle="Funil de qualificação">
              {statusData.length === 0 ? (
                <EmptyChart />
              ) : (
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={88}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <ul className="w-full space-y-2">
                    {statusData.map((entry) => (
                      <li
                        key={entry.name}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-slate-600 dark:text-slate-300">
                          {entry.name}
                        </span>
                        <span className="ml-auto font-semibold text-slate-900 dark:text-slate-100">
                          {entry.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Panel>

            <Panel title="Evolução mensal" subtitle="Últimos 12 meses">
              {monthlyAsc.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyAsc} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="monthlyFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      width={30}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#monthlyFill)"
                      name="Leads"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Panel>

            <Panel
              title="Top produtos"
              subtitle="Maior volume capturado"
              className="lg:col-span-1"
            >
              {summary?.byProduct.length === 0 || emptyLabel(summary?.byProduct ?? []) ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    layout="vertical"
                    data={summary?.byProduct ?? []}
                    margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={96}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={14} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Panel>

            <Panel
              title="Top campanhas"
              subtitle="Origem por campanha (utm)"
              className="lg:col-span-1"
            >
              {summary?.byCampaign.length === 0 || emptyLabel(summary?.byCampaign ?? []) ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    layout="vertical"
                    data={summary?.byCampaign ?? []}
                    margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={96}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#a855f7" radius={[0, 8, 8, 0]} barSize={14} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Panel>
          </div>

          {isAdmin && summary.byUser.length > 0 && (
            <Panel
              title="Ranking por cliente"
              subtitle="Leads capturados por conta"
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500">
                      <th className="pb-2.5 pr-4 font-semibold">Cliente</th>
                      <th className="pb-2.5 pr-4 font-semibold">Total</th>
                      <th className="pb-2.5 pr-4 font-semibold">Pendentes</th>
                      <th className="pb-2.5 pr-4 font-semibold">Aprovados</th>
                      <th className="pb-2.5 pr-4 font-semibold">Reprovados</th>
                      <th className="pb-2.5 font-semibold">Conversão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.byUser.map((row) => (
                      <tr
                        key={row.userId}
                        className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white">
                              {initials(row.user?.name ?? '')}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                                {row.user?.name ?? 'Cliente'}
                              </p>
                              <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                                {row.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-slate-100">
                          {row.total}
                        </td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">
                          {row.pending}
                        </td>
                        <td className="py-3 pr-4 text-emerald-600 dark:text-emerald-400">
                          {row.approved}
                        </td>
                        <td className="py-3 pr-4 text-rose-600 dark:text-rose-400">
                          {row.rejected}
                        </td>
                        <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                          {formatPercent(row.conversionRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </div>
      )}
    </div>
  )
}
