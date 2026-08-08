import { useState } from 'react'
import { Loader2, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useLeadsStore, type Lead } from '../../stores/leadsStore'

type Props = {
  lead: Lead
  onClose: () => void
}

export function DeleteLeadDialog({ lead, onClose }: Props) {
  const deleteLead = useLeadsStore((state) => state.deleteLead)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const deleteError = await deleteLead(lead.id)
    setDeleting(false)

    if (deleteError) {
      toast.error(deleteError)
    } else {
      toast.success('Lead excluído com sucesso!')
      onClose()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Excluir lead"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/50">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <Trash2 className="h-5.5 w-5.5" strokeWidth={1.75} />
        </span>

        <h2 className="mt-4 font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Excluir lead?
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Essa ação é permanente e não pode ser desfeita. O lead de{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {lead.name}
          </span>{' '}
          será removido da plataforma.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
