import { useState } from 'react'
import {
  CheckCircle2,
  KeyRound,
  Layers,
  Loader2,
  Mail,
  Megaphone,
  MoreVertical,
  Package,
  Pencil,
  Phone,
  Target,
  Trash2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDate, initials } from '../../lib/utils'
import { useLeadsStore, type Lead, type LeadStatus } from '../../stores/leadsStore'
import { EditLeadModal } from './EditLeadModal'
import { DeleteLeadDialog } from './DeleteLeadDialog'

const statusStyles: Record<LeadStatus, string> = {
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
}

const statusLabel: Record<LeadStatus, string> = {
  APPROVED: 'Aprovado',
  PENDING: 'Pendente',
  REJECTED: 'Reprovado',
}

export function LeadCard({ lead }: { lead: Lead }) {
  const setStatus = useLeadsStore((state) => state.setStatus)
  const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  function openEdit() {
    setMenuOpen(false)
    setEditing(true)
  }

  function openDelete() {
    setMenuOpen(false)
    setDeleting(true)
  }

  return (
    <article className="group relative flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 dark:hover:shadow-black/40">
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 font-display text-sm font-semibold text-white shadow-md shadow-indigo-500/20">
            {initials(lead.name)}
          </span>
          <div className="min-w-0">
            <p className="font-display truncate text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {lead.name}
            </p>
            <p className="truncate text-xs text-slate-400 dark:text-slate-500">
              Entrou em {formatDate(lead.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1',
              statusStyles[lead.status],
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusLabel[lead.status]}
          </span>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Mais ações"
              aria-expanded={menuOpen}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <MoreVertical className="h-4.5 w-4.5" strokeWidth={1.75} />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute top-full right-0 z-20 mt-1.5 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40">
                  <button
                    onClick={openEdit}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/60 dark:hover:text-white"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                    Editar
                  </button>
                  <button
                    onClick={openDelete}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <dl className="space-y-2.5 border-t border-slate-100 px-5 py-4 text-sm dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <Mail className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          <dt className="sr-only">E-mail</dt>
          <dd className="truncate text-slate-600 dark:text-slate-400">{lead.email || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          <dt className="sr-only">Telefone</dt>
          <dd className="truncate text-slate-600 dark:text-slate-400">{lead.phone || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Package className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          <dt className="sr-only">Produto</dt>
          <dd className="truncate text-slate-600 dark:text-slate-400">{lead.product || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex h-4 w-4 items-center justify-center text-slate-400 dark:text-slate-500">
            <span className="text-[10px] font-bold leading-none">Fi</span>
          </span>
          <dt className="sr-only">Finalidade</dt>
          <dd className="truncate text-slate-600 dark:text-slate-400">{lead.finality || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Target className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          <dt className="sr-only">Anúncio</dt>
          <dd className="truncate text-slate-600 dark:text-slate-400">{lead.utmAnuncioId || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Megaphone className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          <dt className="sr-only">Campanha</dt>
          <dd className="truncate text-slate-600 dark:text-slate-400">{lead.utmCampanha || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Layers className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          <dt className="sr-only">Grupo de anúncio</dt>
          <dd className="truncate text-slate-600 dark:text-slate-400">{lead.utmGrupoAnuncio || '—'}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <KeyRound className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          <dt className="sr-only">Palavra-chave</dt>
          <dd className="truncate text-slate-600 dark:text-slate-400">{lead.utmPalavraChave || '—'}</dd>
        </div>
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
        <button
          onClick={() => handleSetStatus('APPROVED')}
          disabled={lead.status === 'APPROVED' || pendingStatus !== null}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed',
            lead.status === 'APPROVED'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30 dark:hover:bg-emerald-500/20',
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
              : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30 dark:hover:bg-rose-500/20',
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

      {editing && <EditLeadModal lead={lead} onClose={() => setEditing(false)} />}
      {deleting && <DeleteLeadDialog lead={lead} onClose={() => setDeleting(false)} />}
    </article>
  )
}
