import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Loader2,
  Mail,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  Users,
  Webhook,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDate, initials } from '../lib/utils'
import { useUsersStore } from '../stores/usersStore'
import { useAuthStore, type User } from '../stores/authStore'
import { EditCollaboratorModal } from '../components/collaborator/EditCollaboratorModal'
import { DeleteCollaboratorDialog } from '../components/collaborator/DeleteCollaboratorDialog'
import { WebhookModal } from '../components/collaborator/WebhookModal'

const roleBadge: Record<User['role'], string> = {
  ADMIN: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30',
  COLLABORATOR: 'bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/30',
}

const roleLabel: Record<User['role'], string> = {
  ADMIN: 'Administrador',
  COLLABORATOR: 'Colaborador',
}

export default function Collaborator() {
  const [query, setQuery] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [webhookUser, setWebhookUser] = useState<User | null>(null)

  const { users, loading, error, fetchUsers } = useUsersStore()
  const currentUserId = useAuthStore((state) => state.user?.id)

  useEffect(() => {
    if (users === null) {
      fetchUsers()
    }
  }, [users, fetchUsers])

  const filteredUsers =
    users?.filter((user) => {
      const term = query.trim().toLowerCase()
      if (!term) return true
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      )
    }) ?? []

  function handleDeleteClick(user: User) {
    if (user.id === currentUserId) {
      toast.error('Você não pode excluir a própria conta')
      return
    }
    setDeletingUser(user)
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
            <Users className="h-5 w-5 text-white" strokeWidth={2} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Colaboradores
            </h1>
            <p className="text-sm text-slate-500 dark:text-white">
              Gerencie os acessos e permissões da equipe
            </p>
          </div>
        </div>

        <Link
          to="/register"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-md"
        >
          <UserPlus className="h-4 w-4" strokeWidth={2} />
          Novo colaborador
        </Link>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou e-mail"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-white dark:focus:border-indigo-500"
          />
        </div>
        {users && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-white">
            {filteredUsers.length} de {users.length}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading && users === null ? (
          <div className="flex items-center justify-center gap-3 py-24">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            <span className="text-sm text-slate-500 dark:text-white">
              Carregando colaboradores...
            </span>
          </div>
        ) : error && users === null ? (
          <div className="flex flex-col items-center gap-4 py-24">
            <p className="text-sm text-slate-500 dark:text-white">{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/60">
              <Users className="h-6 w-6 text-slate-400 dark:text-white" strokeWidth={1.75} />
            </span>
            <p className="text-sm font-medium text-slate-600 dark:text-white">
              {query ? 'Nenhum colaborador encontrado' : 'Nenhum colaborador cadastrado'}
            </p>
            {!query && (
              <Link
                to="/register"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Cadastrar o primeiro colaborador
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:border-slate-800 dark:text-white">
                <th className="px-6 py-3.5">Colaborador</th>
                <th className="hidden px-4 py-3.5 md:table-cell">E-mail</th>
                <th className="hidden px-4 py-3.5 sm:table-cell">
                  Entrou em
                </th>
                <th className="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-white shadow-sm',
                          user.role === 'ADMIN'
                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
                            : 'bg-gradient-to-br from-cyan-500 to-blue-600',
                        )}
                      >
                        {initials(user.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <span
                          className={cn(
                            'mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1',
                            roleBadge[user.role],
                          )}
                        >
                          {roleLabel[user.role]}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-slate-500 dark:text-white md:table-cell">
                    <span className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white" />
                      {user.email}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 text-slate-500 dark:text-white sm:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setWebhookUser(user)}
                        title="Integração RD Station"
                        aria-label={`Webhook de ${user.name}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-600 dark:text-white dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400"
                      >
                        <Webhook className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => setEditingUser(user)}
                        title="Editar"
                        aria-label={`Editar ${user.name}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-white dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        title="Excluir"
                        aria-label={`Excluir ${user.name}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:text-white dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingUser && (
        <EditCollaboratorModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <DeleteCollaboratorDialog
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
        />
      )}

      {webhookUser && (
        <WebhookModal
          user={webhookUser}
          onClose={() => setWebhookUser(null)}
        />
      )}
    </div>
  )
}
