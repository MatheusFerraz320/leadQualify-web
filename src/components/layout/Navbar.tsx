import { Link, useLocation } from 'react-router'
import {
  Bell,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Moon,
  Sun,
  UserPlus,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'

type NavModule = {
  label: string
  path: string
  icon: typeof LayoutDashboard
  adminOnly?: boolean
}

const navModules: NavModule[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Leads',
    path: '/leads',
    icon: Inbox,
  },
  {
    label: 'Colaboradores',
    path: '/collaborator',
    icon: UserPlus,
    adminOnly: true,
  },
  {
    label: 'Notificações',
    path: '/notificacoes',
    icon: Bell,
  },
  {
    label: 'Ajuda',
    path: '/ajuda',
    icon: LifeBuoy,
  },
]

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  const isPathActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path === '/collaborator') {
      return (
        location.pathname.startsWith('/collaborator') ||
        location.pathname === '/register'
      )
    }
    return location.pathname.startsWith(path)
  }

  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggle)

  const linkClass = (path: string) =>
    cn(
      'flex items-center gap-2 rounded-full px-4 py-2.5 text-base font-medium transition-all duration-200',
      isPathActive(path)
        ? 'bg-white font-semibold text-b2-600 shadow-md shadow-b2-950/25 ring-1 ring-white/30 dark:bg-white/10 dark:text-b2-200 dark:shadow-b2-400/10 dark:ring-b2-400/30 dark:backdrop-blur'
        : 'text-white/85 hover:bg-white/10 hover:text-white dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white',
    )

  return (
    <header className="relative flex h-20 shrink-0 items-center justify-center border-b border-white/10 bg-gradient-to-r from-b2-500 via-b2-600 to-b2-700 px-7 shadow-lg shadow-b2-700/25 dark:from-b2-500 dark:via-b2-600 dark:to-slate-950 dark:shadow-[0_0_45px_-6px_rgba(0,212,255,0.6)]">
      <nav className="flex items-center gap-1.5">
        {navModules.map((module) =>
          module.adminOnly && user?.role !== 'ADMIN' ? null : (
            <Link
              key={module.path}
              to={module.path}
              className={linkClass(module.path)}
            >
              <module.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              {module.label}
            </Link>
          ),
        )}
      </nav>

      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        aria-label={
          theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
        }
        className="absolute top-1/2 right-6 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/90 ring-1 ring-white/20 transition hover:bg-white/20 hover:text-white active:scale-95 dark:bg-white/5 dark:text-b2-200 dark:ring-b2-400/30 dark:hover:bg-white/10 dark:hover:text-white"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" strokeWidth={1.75} />
        ) : (
          <Moon className="h-5 w-5" strokeWidth={1.75} />
        )}
      </button>
    </header>
  )
}
