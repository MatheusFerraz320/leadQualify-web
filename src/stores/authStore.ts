import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

type JwtPayload = {
  sub: string
  email: string
  name?: string
  role?: UserRole
}

type LoginResponse = {
  access_token: string
}

type AuthState = {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<string | null>
  register: (name: string, email: string, password: string, confirm_password: string, role: UserRole) => Promise<string | null>
  logout: () => void
  clearError: () => void
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

function userFromPayload(payload: JwtPayload): User {
  return {
    id: payload.sub,
    name: payload.name ?? '',
    email: payload.email,
    role: payload.role ?? 'COLLABORATOR',
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

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

          const data = (await response.json()) as LoginResponse
          const payload = decodeJwt(data.access_token)

          set({
            token: data.access_token,
            user: payload ? userFromPayload(payload) : null,
            loading: false,
          })
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

      logout: () => set({ token: null, user: null, error: null }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'leadqualify-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && !state?.user) {
          const payload = decodeJwt(state.token)
          if (payload) {
            useAuthStore.setState({ user: userFromPayload(payload) })
          }
        }
      },
    },
  ),
)
