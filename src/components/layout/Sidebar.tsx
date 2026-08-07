import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Home,
  LogOut,
  UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, initials } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'

type NavItem = {
  label: string
  path: string
  icon: typeof Home
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Colaboradores', path: '/colaboradores', icon: UserPlus, adminOnly: true },
  { label: 'Meu perfil', path: '/minha-conta', icon: CircleUser },
]

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin',
  COLLABORATOR: 'Colaborador',
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  function handleLogout() {
    logout()
    navigate('/login')
    toast.success('Logout realizado com sucesso!')
  }

  const displayName = user?.name || user?.email
  const initialsText = initials(user?.name ?? '') || '?'

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300',
        collapsed ? 'w-20' : 'w-72',
      )}
    >
      <div className={cn('px-3 py-4', collapsed && 'px-3')}>
        {user ? (
          <div
            className={cn(
              'group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-violet-50 ring-1 ring-slate-200/60',
              collapsed ? 'flex justify-center p-2' : 'flex items-center gap-3 p-3',
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-indigo-200/40 blur-2xl transition-opacity group-hover:opacity-70"
            />
            <div
              className={cn(
                'relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-display font-semibold tracking-tight text-white shadow-md ring-2 ring-white',
                collapsed ? 'h-11 w-11 text-sm' : 'h-14 w-14 text-lg',
              )}
            >
              {initialsText}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
                  {displayName}
                </p>
                <span className="mt-1 inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium tracking-wide text-indigo-700 ring-1 ring-indigo-100">
                  {roleLabels[user.role] ?? user.role}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              'flex items-center',
              collapsed ? 'justify-center' : 'gap-3 px-1',
            )}
          >
            <img
              src="/b2LightLogo.png"
              alt="Logo LeadQualify"
              className={cn(
                'object-contain',
                collapsed ? 'h-10 w-10' : 'h-9 w-9',
              )}
            />
            {!collapsed && (
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text font-display text-lg font-semibold tracking-tight text-transparent">
                LeadQualify
              </span>
            )}
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
        {!collapsed && (
          <p className="px-3.5 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Menu
          </p>
        )}
        {navItems
          .filter((item) => !item.adminOnly || user?.role === 'ADMIN')
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              aria-label={item.label}
              className={cn(
                'group flex items-center rounded-2xl text-sm transition-all duration-200',
                collapsed ? 'h-11 w-11 justify-center' : 'gap-3 px-4 py-2.5',
                isActive(item.path)
                  ? 'bg-indigo-50 font-semibold text-indigo-700 shadow-sm shadow-indigo-500/5 ring-1 ring-indigo-100'
                  : 'font-medium text-slate-600 hover:translate-x-0.5 hover:bg-slate-100/80 hover:text-slate-900',
              )}
            >
              <item.icon
                className={cn(
                  'shrink-0 transition-transform duration-200',
                  collapsed ? 'h-5 w-5' : 'h-4.5 w-4.5 group-hover:scale-105',
                )}
                strokeWidth={1.75}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive(item.path) && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              )}
            </Link>
          ))}
      </nav>

      <div className="space-y-1 border-t border-slate-100 p-3">
        <button
          onClick={handleLogout}
          title="Sair"
          className={cn(
            'group flex items-center rounded-2xl p-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600',
            collapsed ? 'h-11 w-11 justify-center' : 'w-full gap-3 px-4',
          )}
        >
          <LogOut
            className={cn(
              'shrink-0 transition-transform duration-200',
              collapsed ? 'h-5 w-5' : 'h-4.5 w-4.5 group-hover:scale-105',
            )}
            strokeWidth={1.75}
          />
          {!collapsed && 'Sair'}
        </button>

        <button
          onClick={() => setCollapsed((value) => !value)}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className={cn(
            'group flex items-center rounded-2xl p-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700',
            collapsed ? 'h-11 w-11 justify-center' : 'w-full gap-3 px-4',
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          ) : (
            <>
              <ChevronLeft
                className="h-4.5 w-4.5 shrink-0 group-hover:-translate-x-0.5 transition-transform"
                strokeWidth={1.75}
              />
              Recolher
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
