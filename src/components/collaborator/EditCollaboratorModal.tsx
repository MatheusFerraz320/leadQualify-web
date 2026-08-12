import { useState } from 'react'
import {
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
  UserCog,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'
import { useUsersStore } from '../../stores/usersStore'
import type { User, UserRole } from '../../stores/authStore'

type Props = {
  user: User
  onClose: () => void
}

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-white dark:focus:border-cyan-400 dark:focus:bg-slate-900'

export function EditCollaboratorModal({ user, onClose }: Props) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState<UserRole>(user.role)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const { updateUser } = useUsersStore()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !email) {
      toast.error('Preencha nome e e-mail')
      return
    }
    if (password && password.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres')
      return
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não conferem')
      return
    }

    setSaving(true)
    const updateError = await updateUser(user.id, {
      name: name.trim(),
      email,
      role,
      ...(password ? { password, confirm_password: confirmPassword } : {}),
    })
    setSaving(false)

    if (updateError) {
      toast.error(updateError)
    } else {
      toast.success('Colaborador atualizado com sucesso!')
      onClose()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editar colaborador"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-slate-200/70 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/50">
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

        <div className="p-7 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Editar colaborador
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-white">
                Atualize os dados de {user.name}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-white dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-white"
                >
                  Nome
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="edit-name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-email"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-white"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="edit-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-role"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-white"
              >
                Função
              </label>
              <div className="relative">
                <UserCog className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                <select
                  id="edit-role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as UserRole)
                  }
                  className={cn(inputClass, 'appearance-none pr-10')}
                >
                  <option value="COLLABORATOR">Colaborador</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white" />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white">
                Nova senha (opcional)
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Deixe em branco para manter"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={cn(inputClass, 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label="Mostrar ou ocultar senha"
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600 dark:text-white dark:hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {password && (
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirme a nova senha"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className={cn(inputClass, 'pr-11')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((value) => !value)}
                      aria-label="Mostrar ou ocultar confirmação"
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600 dark:text-white dark:hover:text-white"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar alterações'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
