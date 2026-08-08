import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function RequireAuth() {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.error('Você precisa estar logado para acessar essa rota');
    }
  }, []); 

 
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }


  return <Outlet />;
}