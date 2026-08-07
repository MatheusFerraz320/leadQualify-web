import { Link, useLocation } from 'react-router'
import {
  Bell,
  CircleUser,
  LayoutDashboard,
  LifeBuoy,
  UserPlus,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'

type NavModule = {
  label: string
  subtitle: string
  path: string
  icon: typeof LayoutDashboard
  adminOnly?: boolean
}

const navModules: NavModule[] = [
  {
    label: 'Dashboard',
    subtitle: 'Visão geral da operação',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Colaboradores',
    subtitle: 'Gerencie os acessos da equipe',
    path: '/colaboradores',
    icon: UserPlus,
    adminOnly: true,
  },
  {
    label: 'Notificações',
    subtitle: 'Alertas e novidades',
    path: '/notificacoes',
    icon: Bell,
  },
  {
    label: 'Minha conta',
    subtitle: 'Suas informações pessoais',
    path: '/minha-conta',
    icon: CircleUser,
  },
  {
    label: 'Ajuda',
    subtitle: 'Suporte e documentação',
    path: '/ajuda',
    icon: LifeBuoy,
  },
]

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  const isPathActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path === '/colaboradores') {
      return (
        location.pathname.startsWith('/colaboradores') ||
        location.pathname === '/register'
      )
    }
    return location.pathname.startsWith(path)
  }

  const activeModule = navModules.find((module) => isPathActive(module.path)) ?? navModules[0]

  const linkClass = (path: string) =>
    cn(
      'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200',
      isPathActive(path)
        ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-500/5 ring-1 ring-indigo-100'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
    )

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-7 shadow-sm shadow-slate-200/40">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/25">
          <activeModule.icon className="h-5 w-5 text-white" strokeWidth={2} />
        </span>
        <div className="leading-tight">
          <h1 className="font-display text-lg font-semibold tracking-tight text-slate-900">
            {activeModule.label}
          </h1>
          <p className="text-xs font-medium text-slate-400">
            {activeModule.subtitle}
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-1.5">
        {navModules.map((module) =>
          module.adminOnly && user?.role !== 'ADMIN' ? null : (
            <Link
              key={module.path}
              to={module.path}
              className={linkClass(module.path)}
            >
              <module.icon className="h-4 w-4" strokeWidth={1.75} />
              {module.label}
            </Link>
          ),
        )}
      </nav>
    </header>
  )
}
