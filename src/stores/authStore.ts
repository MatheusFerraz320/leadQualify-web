import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type LoginResponse = {
  access_token: string
}

type AuthState = {
  token: string | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<string | null>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })

        try {
          const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const body = await response.json().catch(() => null)
            const message =
              Array.isArray(body?.message) ? body.message[0] : body?.message
            throw new Error(message ?? 'Erro ao fazer login')
          }

          const data = (await response.json()) as LoginResponse
          set({ token: data.access_token, loading: false })
          return null
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Erro ao fazer login'
          set({ loading: false, error: message })
          return message
        }
      },

      logout: () => set({ token: null, error: null }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'leadqualify-auth',
      partialize: (state) => ({ token: state.token }),
    },
  ),
)
