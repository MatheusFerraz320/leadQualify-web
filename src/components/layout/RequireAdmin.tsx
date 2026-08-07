import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'sonner'
import { useEffect } from 'react'

export function RequireAdmin() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  useEffect(() => {
    if (!user) {
      toast.error('Você precisa estar logado para acessar essa rota')
    } else if (user.role !== 'ADMIN') {
      toast.error('Acesso restrito a administradores')
    }
  }, [user])

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
