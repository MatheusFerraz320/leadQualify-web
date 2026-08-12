import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  Bell,
  LogOut,
  Moon,
  Settings,
  Sun,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, initials } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import { navModules } from '../../lib/navigation'

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const location = useLocation()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggle)

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

  const linkClass = (path: string) =>
    cn(
      'flex items-center gap-2 rounded-full px-4 py-2.5 text-base font-medium drop-shadow-[0_1px_2px_rgba(0,61,82,0.45)] transition-all duration-200',
      isPathActive(path)
        ? 'bg-white font-semibold text-b2-700 shadow-md shadow-b2-950/25 ring-1 ring-white/40 dark:bg-b2-950/50 dark:bg-gradient-to-r dark:from-b2-900/30 dark:via-b2-600/20 dark:to-b2-700/30 dark:font-semibold dark:text-white dark:shadow-[0_0_24px_-4px_rgba(0,212,255,0.55)] dark:ring-b2-300/50 dark:backdrop-blur-md dark:drop-shadow-none'
        : 'text-white/95 hover:bg-white/15 hover:text-white dark:text-white dark:hover:bg-white/15 dark:hover:text-white dark:hover:shadow-[0_0_16px_-6px_rgba(0,212,255,0.45)] dark:hover:ring-white/20',
    )

  async function handleLogout() {
    setMenuOpen(false)
    await logout()
    navigate('/login')
    toast.success('Logout realizado com sucesso!')
  }

  const initialsText = initials(user?.name ?? '') || '?'

  return (
    <header className="relative z-50 flex h-25  mx-3 mt-3 rounded-2xl
    shrink-0 items-center justify-center border-b border-white/10 bg-[#1A3F62] px-7 shadow-lg shadow-b2-700/80 
    dark:from-b2-500 dark:via-b2-700 dark:to-slate-900 dark:shadow-[0_0_45px_-6px_rgba(0,212,255,0.6)]">
      <Link
        to="/"
        className="absolute top-1/2 left-7 flex -translate-y-1/2 items-center gap-2.5"
        aria-label="LeadQualify"
      >
        <img 
          src="/b2DarkLogo.png"
          alt="logo da b2"
          className="h-15 w-15 object-contain drop-shadow"
        />
        <span className="hidden font-display text-lg font-semibold tracking-tight text-white lg:block">
          Qualificador de leads
        </span>
      </Link>

      <nav className="flex items-center gap-1.5">
        {navModules.map((module) =>
          module.adminOnly && user?.role !== 'ADMIN' ? null : (
            <Link
              key={module.to}
              to={module.to}
              className={linkClass(module.to)}
            >
              <module.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              {module.label}
            </Link>
          ),
        )}
      </nav>

      <div className="absolute top-1/2 right-6 flex -translate-y-1/2 items-center gap-1.5">
        <Link
          to="/notificacoes"
          title="Notificações"
          aria-label="Notificações"
          aria-current={isPathActive('/notificacoes') ? 'page' : undefined}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full transition active:scale-95',
            isPathActive('/notificacoes')
              ? 'bg-white/25 text-white ring-1 ring-white/40 dark:bg-white/10 dark:text-white dark:ring-b2-400/40'
              : 'bg-white/10 text-white/90 ring-1 ring-white/20 hover:bg-white/20 hover:text-white dark:bg-white/5 dark:text-b2-200 dark:ring-b2-400/30 dark:hover:bg-white/10 dark:hover:text-white',
          )}
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </Link>

        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          aria-label={
            theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
          }
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 ring-1 ring-white/20 transition hover:bg-white/20 hover:text-white active:scale-95 dark:bg-white/5 dark:text-b2-200 dark:ring-b2-400/30 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={1.75} />
          )}
        </button>

        <button
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 ring-1 ring-white/20 transition hover:bg-rose-600/90 hover:text-white active:scale-95 dark:bg-white/5 dark:text-b2-200 dark:ring-b2-400/30 dark:hover:bg-rose-600/90 dark:hover:text-white"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            title="Menu do usuário"
            aria-label="Menu do usuário"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 ring-1 ring-white/20 transition hover:bg-white/20 hover:text-white active:scale-95 dark:bg-white/5 dark:text-b2-200 dark:ring-b2-400/30 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-display text-xs font-semibold text-white">
              {initialsText}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40">
              <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-700">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.name || user?.email}
                </p>
                <p className="truncate text-xs text-slate-400 dark:text-white">
                  {user?.email}
                </p>
              </div>
              <Link
                to="/minha-conta"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-white dark:hover:bg-slate-700/60 dark:hover:text-white"
              >
                <Settings className="h-4 w-4" strokeWidth={1.75} />
                Configurações
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
