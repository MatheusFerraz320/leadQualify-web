import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '../../stores/authStore'
import { Loader2 } from 'lucide-react'

export function RequireAuth() {
  const status = useAuthStore((state) => state.status)
  const location = useLocation()

  if (status === 'idle' || status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-slate-100 dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        <span className="text-sm text-slate-500 dark:text-white">
          Carregando...
        </span>
      </div>
    )
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
