import { useState } from 'react'
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../lib/utils'
import { useAuthStore } from '../stores/authStore'
import { useUsersStore } from '../stores/usersStore'

const inputClass =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 text-base text-slate-900 placeholder:text-slate-400 transition outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-white dark:focus:border-cyan-400 dark:focus:bg-slate-900'

export default function MinhaConta() {
  const user = useAuthStore((state) => state.user)
  const { updateMe } = useUsersStore()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)

  const roleLabel = user?.role === 'ADMIN' ? 'Administrador' : 'Colaborador'

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
    const updateError = await updateMe({
      name: name.trim(),
      email,
      ...(password ? { password, confirm_password: confirmPassword } : {}),
    })
    setSaving(false)

    if (updateError) {
      toast.error(updateError)
    } else {
      setPassword('')
      setConfirmPassword('')
      toast.success('Perfil atualizado com sucesso!')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
          <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Minha conta
          </h1>
          <p className="text-sm text-slate-500 dark:text-white">
            Atualize suas informações pessoais e de acesso
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

        <div className="p-8 sm:p-10">
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100 dark:bg-slate-800/60 dark:ring-slate-700/50">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-semibold text-white">
              {name.slice(0, 2).toUpperCase() || '?'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {name}
              </p>
              <span className="text-xs font-medium text-slate-500 dark:text-white">
                {roleLabel}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="me-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-white"
                >
                  Nome
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="me-name"
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
                  htmlFor="me-email"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-white"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="me-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
              <p className="mb-1 text-sm font-medium text-slate-700 dark:text-white">
                Alterar senha
              </p>
              <p className="mb-4 text-xs text-slate-400 dark:text-white">
                Deixe em branco para manter a senha atual
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nova senha"
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
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>

                {password && (
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
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
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
