import { useState } from 'react'
import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  Megaphone,
  MoreVertical,
  Package,
  Pencil,
  Phone,
  Trash2,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDate, initials } from '../../lib/utils'
import { useLeadsStore, type Lead, type LeadStatus } from '../../stores/leadsStore'
import { EditLeadModal } from './EditLeadModal'
import { DeleteLeadDialog } from './DeleteLeadDialog'
import { useAuthStore } from '../../stores/authStore'

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

const fieldTitle =
  'flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white'
const fieldValue = 'mt-0.5 truncate text-sm text-slate-700 dark:text-white'

function InfoField({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon
  label: string
  value?: string | null
  href?: string
}) {
  const content = value?.trim() || '—'
  return (
    <div className="min-w-0">
      <dt className={fieldTitle}>
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        {label}
      </dt>
      <dd className={fieldValue}>
        {href && value ? (
          <a
            href={href}
            className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </dd>
    </div>
  )
}

export function LeadCard({ lead }: { lead: Lead }) {
  const setStatus = useLeadsStore((state) => state.setStatus)
  const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
    const user = useAuthStore((state) => state.user)
  

  const utmFields = [
    { label: 'Campanha', value: lead.utmCampanha },
    { label: 'Grupo de anúncio', value: lead.utmGrupoAnuncio },
    { label: 'Palavra-chave', value: lead.utmPalavraChave },
  ]

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
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 dark:hover:shadow-black/40">
      <div className="border-b border-slate-100 p-4 dark:border-slate-800">
        <div className="mb-2.5 flex items-center justify-between gap-2">
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
            {user.role === 'ADMIN' && (
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Mais ações"
              aria-expanded={menuOpen}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-white dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <MoreVertical className="h-4.5 w-4.5" strokeWidth={1.75} />
            </button>
              )}

            {menuOpen && user?.role === 'ADMIN' && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute top-full right-0 z-20 mt-1.5 w-40 overflow-hidden rounded-2xl 
                border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800 
                dark:shadow-black/40">
                  {user?.role === 'ADMIN' && (
                  <button
                    onClick={openEdit}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-white dark:hover:bg-slate-700/60 dark:hover:text-white"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                    Editar
                  </button>
                     )}
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

        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-display text-sm font-semibold text-white shadow-md shadow-indigo-500/20">
            {initials(lead.name)}
          </span>
          <div className="min-w-0">
            <p className="font-display truncate text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">
              {lead.name}
            </p>
            <p className="truncate text-xs text-slate-400 dark:text-white">
              {formatDate(lead.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4">
        <InfoField
          icon={Phone}
          label="Telefone"
          value={lead.phone}
          href={`tel:${lead.phone?.replace(/[^\d+]/g, '')}`}
        />
        <InfoField icon={Mail} label="E-mail" value={lead.email} href={`mailto:${lead.email}`} />
        <InfoField icon={Package} label="Produto" value={lead.product} />
        <InfoField icon={Building2} label="Finalidade" value={lead.finality} />
      </dl>

      <div className="border-t border-slate-100 p-4 pt-3.5 dark:border-slate-800">
          <p className={cn(fieldTitle, 'gap-1.5')}>
            <Megaphone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            Origem (UTM)
          </p>
          <div className="mt-2 space-y-1.5">
            {utmFields.map((field) => (
              <div key={field.label} className="flex items-baseline gap-3">
                <dt className="w-28 shrink-0 text-xs text-slate-400 dark:text-white">
                  {field.label}
                </dt>
                <dd className="truncate text-sm text-slate-700 dark:text-white">
                  {field.value?.trim() || '—'}
                </dd>
              </div>
            ))}
          </div>
        </div>

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
        <button
          onClick={() => handleSetStatus('APPROVED')}
          disabled={lead.status === 'APPROVED' || pendingStatus !== null}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed',
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
            'flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed',
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