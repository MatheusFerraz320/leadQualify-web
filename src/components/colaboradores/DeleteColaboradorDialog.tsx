import { useState } from 'react'
import { Loader2, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useUsersStore } from '../../stores/usersStore'
import type { User } from '../../stores/authStore'

type Props = {
  user: User
  onClose: () => void
}

export function DeleteColaboradorDialog({ user, onClose }: Props) {
  const [deleting, setDeleting] = useState(false)
  const { deleteUser } = useUsersStore()

  async function handleDelete() {
    setDeleting(true)
    const deleteError = await deleteUser(user.id)
    setDeleting(false)

    if (deleteError) {
      toast.error(deleteError)
    } else {
      toast.success('Colaborador excluído com sucesso!')
      onClose()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Excluir colaborador"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-7 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Trash2 className="h-5.5 w-5.5" strokeWidth={1.75} />
        </span>

        <h2 className="mt-4 font-display text-lg font-semibold tracking-tight text-slate-900">
          Excluir colaborador?
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Essa ação é permanente e não pode ser desfeita. O acesso de{' '}
          <span className="font-semibold text-slate-700">{user.name}</span>{' '}
          será removido da plataforma.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
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
