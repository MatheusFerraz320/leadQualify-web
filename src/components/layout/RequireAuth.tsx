import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '../../stores/authStore'
import { BrandedLoader } from './BrandedLoader'

export function RequireAuth() {
  const status = useAuthStore((state) => state.status)
  const location = useLocation()

  if (status === 'idle' || status === 'checking') {
    return <BrandedLoader variant="fullscreen" label="Carregando..." />
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
