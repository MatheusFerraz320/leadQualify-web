import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  ArrowRight,
  ChevronDown,
  CircleCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserCog,
  UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../lib/utils'
import { useAuthStore, type UserRole } from '../stores/authStore'
import { useUsersStore } from '../stores/usersStore'
export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [role, setRole] = useState<UserRole>('COLLABORATOR')
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useAuthStore()
  const { fetchUsers } = useUsersStore()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos')
      return
    }
    if (password.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres')
      return
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não conferem')
      return
    }
    clearError()
    const registerError = await register(
      name.trim(),
      email,
      password,
      confirmPassword,
      role,
    )
    if (registerError) {
      toast.error(registerError)
    } else {
      toast.success('Colaborador cadastrado com sucesso!')
      await fetchUsers()
      navigate('/collaborator', { replace: true })
    }
  }

  const inputClass =
    'h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 text-base text-slate-900 placeholder:text-slate-400 transition outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.35),0_0_24px_rgba(6,182,212,0.12)] dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-slate-900'

  return (
    <div className="relative flex min-h-full items-center justify-center px-6 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-12 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10"
      />

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

          <div className="p-8 sm:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                <UserPlus className="h-7 w-7 text-white" strokeWidth={1.75} />
              </div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Cadastrar colaborador
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Crie o acesso de um novo membro da equipe.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Nome
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Nome do colaborador"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="voce@empresa.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Função
                </label>
                <div className="relative">
                  <UserCog className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <select
                    id="role"
                    required
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as UserRole)
                    }
                    className={cn(inputClass, 'appearance-none pr-10')}
                  >
                    <option value="COLLABORATOR">Colaborador</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Mínimo de 8 caracteres"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={cn(inputClass, 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {password && (
                  <p
                    className={cn(
                      'mt-1.5 flex items-center gap-1.5 text-xs font-medium transition-colors',
                      password.length >= 8 ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500',
                    )}
                  >
                    <CircleCheck className="h-3.5 w-3.5" />
                    {password.length >= 8
                      ? 'Senha válida'
                      : `Mínimo de 8 caracteres (${password.length}/8)`}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={cn(inputClass, 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((value) => !value)}
                    aria-label={
                      showConfirm ? 'Ocultar senha' : 'Mostrar senha'
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <p
                    className={cn(
                      'mt-1.5 flex items-center gap-1.5 text-xs font-medium transition-colors',
                      password === confirmPassword
                        ? 'text-cyan-600'
                        : 'text-rose-500',
                    )}
                  >
                    <CircleCheck className="h-3.5 w-3.5" />
                    {password === confirmPassword
                      ? 'Senhas conferem'
                      : 'As senhas não conferem'}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm font-medium text-rose-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-400/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Cadastrando...' : 'Criar acesso'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <Link
              to="/collaborator"
              className="mt-6 block text-center text-sm text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Voltar para colaboradores
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
