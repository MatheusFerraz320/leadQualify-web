import { useState } from 'react'
import {
  CheckCircle2,
  KeyRound,
  Layers,
  Loader2,
  Mail,
  Megaphone,
  Package,
  Phone,
  Target,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDate, initials } from '../../lib/utils'
import { useLeadsStore, type Lead, type LeadStatus } from '../../stores/leadsStore'

const statusStyles: Record<LeadStatus, string> = {
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-200',
}

const statusLabel: Record<LeadStatus, string> = {
  APPROVED: 'Aprovado',
  PENDING: 'Pendente',
  REJECTED: 'Reprovado',
}

export function LeadCard({ lead }: { lead: Lead }) {
  const setStatus = useLeadsStore((state) => state.setStatus)
  const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null)

  async function handleSetStatus(status: LeadStatus) {
    if (status === lead.status || pendingStatus) return
    setPendingStatus(status)
    const updateError = await setStatus(lead.id, status)
    setPendingStatus(null)
    if (updateError) {
      toast.error(updateError)
    } else {
      toast.success(
        `Lead ${status === 'APPROVED' ? 'aprovado' : 'reprovado'} com sucesso`,
      )
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 font-display text-sm font-semibold text-white shadow-md shadow-indigo-500/20">
            {initials(lead.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight text-slate-900">
              {lead.name}
            </p>
            <p className="truncate text-xs text-slate-400">
              Entrou em {formatDate(lead.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1',
            statusStyles[lead.status],
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {statusLabel[lead.status]}
        </span>
      </div>

      <dl className="space-y-2.5 border-t border-slate-100 px-5 py-4 text-sm">
        <div className="flex items-center gap-2.5">
          <Mail className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
          <dt className="sr-only">E-mail</dt>
          <dd className="truncate text-slate-600">{lead.email || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
          <dt className="sr-only">Telefone</dt>
          <dd className="truncate text-slate-600">{lead.phone || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Package className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
          <dt className="sr-only">Produto</dt>
          <dd className="truncate text-slate-600">{lead.product || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex h-4 w-4 items-center justify-center text-slate-400">
            <span className="text-[10px] font-bold leading-none">Fi</span>
          </span>
          <dt className="sr-only">Finalidade</dt>
          <dd className="truncate text-slate-600">{lead.finality || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Target className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
          <dt className="sr-only">Anúncio</dt>
          <dd className="truncate text-slate-600">{lead.utmAnuncioId || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Megaphone className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
          <dt className="sr-only">Campanha</dt>
          <dd className="truncate text-slate-600">{lead.utmCampanha || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Layers className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
          <dt className="sr-only">Grupo de anúncio</dt>
          <dd className="truncate text-slate-600">{lead.utmGrupoAnuncio || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <KeyRound className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
          <dt className="sr-only">Palavra-chave</dt>
          <dd className="truncate text-slate-600">{lead.utmPalavraChave || '—'}</dd>
        </div>
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 p-4">
        <button
          onClick={() => handleSetStatus('APPROVED')}
          disabled={lead.status === 'APPROVED' || pendingStatus !== null}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed',
            lead.status === 'APPROVED'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100',
          )}
        >
          {pendingStatus === 'APPROVED' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
          )}
          Aprovar
        </button>
        <button
          onClick={() => handleSetStatus('REJECTED')}
          disabled={lead.status === 'REJECTED' || pendingStatus !== null}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed',
            lead.status === 'REJECTED'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/25'
              : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100',
          )}
        >
          {pendingStatus === 'REJECTED' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" strokeWidth={2} />
          )}
          Reprovar
        </button>
      </div>
    </article>
  )
}
