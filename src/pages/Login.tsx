import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
type User = {
  email: string
  password: string
}

export default function Login() {
  const [email, setEmail] = useState<User['email']>('')
  const [password, setPassword] = useState<User['password']>('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error , setError ] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    if (!email || !password ) {
      setError('Preencha todos os campos')
      toast.error('Preencha todos os campos')
    }
    setTimeout(() => {
      setLoading(false)
      toast.success('Login efetuado com sucesso!')
    }, 2000)

  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-sans">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-sky-200/40 blur-3xl"
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-1 flex flex-col items-center text-center">
            <div className="mb-1 flex items-center justify-center rounded-2xl">
              <img src="/b2LightLogo.png" className="h-50 w-50 object-contain" alt="Logo" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text font-display text-4xl font-semibold tracking-tight text-transparent">
              LeadQualify
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Qualifique seus leads com inteligência
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-12">
            <h2 className="text-xl font-semibold text-slate-900">
              Bem-vindo de volta
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Acesse sua conta para continuar.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="voce@empresa.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-base text-slate-900 placeholder:text-slate-400 transition outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Senha
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline"
                  >
                    Esqueci minha senha
                  </a>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 text-base text-slate-900 placeholder:text-slate-400 transition outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600"
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
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Entrando...' : 'Entrar'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Não tem acesso? Fale com o administrador da sua empresa.
          </p>
        </div>
      </div>
    </main>
  )
}
