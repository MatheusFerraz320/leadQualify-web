import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import Colaboradores from './pages/Colaboradores'
import MinhaConta from './pages/MinhaConta'
import { Layout } from './components/layout/Layout'
import { RequireAuth } from './components/layout/RequireAuth'
import { RequireAdmin } from './components/layout/RequireAdmin'

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="minha-conta" element={<MinhaConta />} />
            <Route element={<RequireAdmin />}>
              <Route path="colaboradores" element={<Colaboradores />} />
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
