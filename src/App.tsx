import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import { useThemeStore } from './stores/themeStore'
import { useAuthStore } from './stores/authStore'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import Collaborator from './pages/Collaborator'
import MinhaConta from './pages/MinhaConta'
import Leads from './pages/Leads'
import { Layout } from './components/layout/Layout'
import { RequireAuth } from './components/layout/RequireAuth'
import { RequireAdmin } from './components/layout/RequireAdmin'

function App() {
  const theme = useThemeStore((state) => state.theme)
  const authStatus = useAuthStore((state) => state.status)
  const bootstrap = useAuthStore((state) => state.bootstrap)

  useEffect(() => {
    if (authStatus === 'idle') {
      bootstrap()
    }
  }, [authStatus, bootstrap])

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" theme={theme} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="leads" element={<Leads />} />
            <Route path="minha-conta" element={<MinhaConta />} />
            <Route element={<RequireAdmin />}>
              <Route path="collaborator" element={<Collaborator />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
