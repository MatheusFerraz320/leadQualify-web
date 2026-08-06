import { Link, useLocation } from 'react-router'
import { Bell, LifeBuoy, UserPlus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'

const moduleLabels: Record<string, string> = {
  '/': 'Início',
  '/register': 'Cadastrar colaborador',
  '/notificacoes': 'Notificações',
  '/ajuda': 'Ajuda',
}

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  const moduleName = moduleLabels[location.pathname] ?? 'Início'

  const linkClass = (path: string) =>
    cn(
      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
      location.pathname === path
        ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-500/5 ring-1 ring-indigo-100'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
    )

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-7 shadow-sm shadow-slate-200/40">
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-500/40" />
        <span className="font-display text-2xl font-semibold tracking-tight text-slate-900">
          {moduleName}
        </span>
      </div>

      <nav className="flex items-center gap-2">
        {user?.role === 'ADMIN' && (
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-md"
          >
            <UserPlus className="h-4 w-4" strokeWidth={2} />
            Cadastrar colaborador
          </Link>
        )}
        <Link to="/notificacoes" className={linkClass('/notificacoes')}>
          <Bell className="h-4 w-4" strokeWidth={1.75} />
          Notificações
        </Link>
        <Link to="/ajuda" className={linkClass('/ajuda')}>
          <LifeBuoy className="h-4 w-4" strokeWidth={1.75} />
          Ajuda
        </Link>
      </nav>
    </header>
  )
}
