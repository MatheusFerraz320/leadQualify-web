import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../stores/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login, loading, error, clearError, status } = useAuthStore()

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }
    clearError()
    const loginError = await login(email, password)
    if (loginError) {
      toast.error(loginError)
    } else {
      toast.success('Login efetuado com sucesso!')
      navigate('/', { replace: true })
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-sans dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl dark:bg-indigo-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10"
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-1 flex flex-col items-center text-center">
            <div className="mb-1 flex items-center justify-center rounded-2xl">
              <img src="/b2LightLogo.png" className="h-50 w-50 object-contain dark:hidden" alt="Logo" />
              <img src="/b2DarkLogo.png" className="h-50 w-50 object-contain hidden dark:block mb-6" alt="Logo" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text font-display text-4xl font-semibold tracking-tight text-transparent">
              ILM
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Qualifique seus leads com inteligência
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-xl 
          shadow-slate-200/60 backdrop-blur sm:p-12 dark:border-slate-800 dark:bg-white/[0.04] dark:shadow-black/40">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 text-center">
              Bem-vindo de volta
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 text-center">
              Acesse sua conta para continuar.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="voce@empresa.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-base text-slate-900 placeholder:text-slate-400 transition outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Senha
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Esqueci minha senha
                  </a>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 text-base text-slate-900 placeholder:text-slate-400 transition outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
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
              </div>

              {error && (
                <p className="text-sm font-medium text-rose-500">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 text-base font-semibold text-white 
                shadow-lg shadow-indigo-500/25 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed 
                disabled:opacity-70"
              >
                {loading ? 'Entrando...' : 'Entrar'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500">
            Algum problema com seu acesso? entre em contato com a B2
          </p>
        </div>
      </div>
    </main>
  )
}
