import { create } from 'zustand'
import { api, getErrorMessage } from '../lib/api'

export type UserRole = 'ADMIN' | 'COLLABORATOR'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
  updatedAt?: string
}

export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'guest'

type AuthState = {
  user: User | null
  status: AuthStatus
  loading: boolean
  error: string | null
  bootstrap: () => Promise<void>
  login: (email: string, password: string) => Promise<string | null>
  register: (
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    role: UserRole,
  ) => Promise<string | null>
  logout: () => Promise<void>
  handleUnauthorized: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: 'idle',
  loading: false,
  error: null,

  bootstrap: async () => {
    if (get().status === 'checking' || get().status === 'authenticated') return
    set({ status: 'checking' })
    try {
      const response = await api('/auth/me')
      if (response.ok) {
        const user = (await response.json()) as User
        set({ user, status: 'authenticated' })
      } else {
        set({ user: null, status: 'guest' })
      }
    } catch {
      set({ user: null, status: 'guest' })
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const response = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao fazer login')
      }

      const data = (await response.json()) as { user: User }
      set({ user: data.user, status: 'authenticated', loading: false })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao fazer login'
      set({ loading: false, error: message })
      return message
    }
  },

  register: async (name, email, password, confirm_password, role) => {
    set({ loading: true, error: null })
    try {
      const response = await api('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, confirm_password, role }),
      })

      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao cadastrar')
      }

      set({ loading: false })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao cadastrar'
      set({ loading: false, error: message })
      return message
    }
  },

  logout: async () => {
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch {
      // cookie pode já estar expirado; segue o fluxo mesmo assim
    }
    set({ user: null, status: 'guest', error: null })
  },

  handleUnauthorized: () => {
    if (get().status !== 'guest') {
      set({ user: null, status: 'guest', error: null })
    }
  },

  clearError: () => set({ error: null }),
}))
