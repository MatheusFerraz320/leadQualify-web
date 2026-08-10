import { create } from 'zustand'
import { api, getErrorMessage } from '../lib/api'
import { useAuthStore, type User, type UserRole } from './authStore'

export type UpdateUserPayload = {
  name?: string
  email?: string
  role?: UserRole
  password?: string
}

export type UpdateProfilePayload = {
  name?: string
  email?: string
  password?: string
  confirm_password?: string
}

type UsersState = {
  users: User[] | null
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<string | null>
  updateUser: (id: string, payload: UpdateUserPayload) => Promise<string | null>
  deleteUser: (id: string) => Promise<string | null>
  updateMe: (payload: UpdateProfilePayload) => Promise<string | null>
  fetchWebhookToken: (id: string) => Promise<string | null>
  rotateWebhookToken: (id: string) => Promise<string | null>
}

export const useUsersStore = create<UsersState>()((set, get) => ({
  users: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api('/users')
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao carregar colaboradores')
      }
      set({ users: (await response.json()) as User[], loading: false })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar colaboradores'
      set({ loading: false, error: message })
      return message
    }
  },

  updateUser: async (id, payload) => {
    set({ error: null })
    try {
      const response = await api(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao atualizar colaborador')
      }
      const updated = (await response.json()) as User
      set({
        users:
          get().users?.map((user) => (user.id === id ? updated : user)) ??
          null,
      })
      if (updated.id === useAuthStore.getState().user?.id) {
        useAuthStore.setState({ user: updated })
      }
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao atualizar colaborador'
      set({ error: message })
      return message
    }
  },

  deleteUser: async (id) => {
    set({ error: null })
    try {
      const response = await api(`/users/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao excluir colaborador')
      }
      set({
        users: get().users?.filter((user) => user.id !== id) ?? null,
      })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao excluir colaborador'
      set({ error: message })
      return message
    }
  },

  updateMe: async (payload) => {
    set({ error: null })
    try {
      const response = await api('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao atualizar perfil')
      }
      const updated = (await response.json()) as User
      useAuthStore.setState({ user: updated })
      set({
        users:
          get().users?.map((user) =>
            user.id === updated.id ? updated : user,
          ) ?? null,
      })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao atualizar perfil'
      set({ error: message })
      return message
    }
  },

  fetchWebhookToken: async (id) => {
    set({ error: null })
    try {
      const response = await api(`/users/${id}/rdstation-token`)
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao carregar token de webhook')
      }
      const data = (await response.json()) as { rdWebhookToken: string | null }
      return data.rdWebhookToken
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar token de webhook'
      set({ error: message })
      return null
    }
  },

  rotateWebhookToken: async (id) => {
    set({ error: null })
    try {
      const response = await api(`/users/${id}/rdstation-token`, {
        method: 'POST',
      })
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao regenerar token')
      }
      const data = (await response.json()) as { rdWebhookToken: string | null }
      return data.rdWebhookToken
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao regenerar token'
      set({ error: message })
      return null
    }
  },
}))
