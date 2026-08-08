import { create } from 'zustand'
import { api, getErrorMessage } from '../lib/api'
import type { User } from './authStore'

export type LeadStatus = 'APPROVED' | 'PENDING' | 'REJECTED'

export type Lead = {
  id: string
  userId: string
  name: string
  email: string | null
  phone: string
  product: string
  finality: string
  utmAnuncioId: string | null
  utmCampanha: string | null
  utmGrupoAnuncio: string | null
  utmPalavraChave: string | null
  status: LeadStatus
  createdAt: string
  updatedAt: string
  user?: { id: string; name: string; email: string }
}

export type ClientSummary = {
  userId: string
  user: { id: string; name: string; email: string } | null
  total: number
}

export type UpdateLeadPayload = {
  name?: string
  email?: string
  phone?: string
  product?: string
  finality?: string
  status?: LeadStatus
}

type UsersByLeadCount = Array<{ userId: string; total: number }>

type LeadsState = {
  leads: Lead[] | null
  clients: ClientSummary[] | null
  selectedClientId: string | null
  loading: boolean
  error: string | null
  clientsLoading: boolean
  clientsError: string | null
  fetchClients: () => Promise<string | null>
  fetchLeads: (userId?: string) => Promise<string | null>
  selectClient: (userId: string | null) => void
  setStatus: (id: string, status: LeadStatus) => Promise<string | null>
  updateLead: (id: string, payload: UpdateLeadPayload) => Promise<string | null>
  deleteLead: (id: string) => Promise<string | null>
}

export const useLeadsStore = create<LeadsState>()((set, get) => ({
  leads: null,
  clients: null,
  selectedClientId: null,
  loading: false,
  error: null,
  clientsLoading: false,
  clientsError: null,

  fetchClients: async () => {
    set({ clientsLoading: true, clientsError: null })
    try {
      const [usersResponse, countResponse] = await Promise.all([
        api('/users'),
        api('/leads/by-user'),
      ])

      if (!usersResponse.ok) {
        const message = await getErrorMessage(usersResponse)
        throw new Error(message || 'Erro ao carregar clientes')
      }

      const users = (await usersResponse.json()) as User[]

      let counts: Map<string, number> = new Map()
      if (countResponse.ok) {
        const data = (await countResponse.json()) as UsersByLeadCount
        counts = new Map(data.map((item) => [item.userId, item.total]))
      }

      const clients: ClientSummary[] = users
        .map((user) => ({
          userId: user.id,
          user: { id: user.id, name: user.name, email: user.email },
          total: counts.get(user.id) ?? 0,
        }))
        .sort(
          (a, b) =>
            b.total - a.total ||
            (a.user?.name ?? '').localeCompare(b.user?.name ?? ''),
        )

      set({ clients, clientsLoading: false })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar clientes'
      set({ clients: null, clientsLoading: false, clientsError: message })
      return message
    }
  },

  fetchLeads: async (userId) => {
    set({ loading: true, error: null, selectedClientId: userId ?? null })
    try {
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : ''
      const response = await api(`/leads${query}`)
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao carregar leads')
      }
      set({ leads: (await response.json()) as Lead[], loading: false })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar leads'
      set({ leads: null, loading: false, error: message })
      return message
    }
  },

  selectClient: (userId) => set({ selectedClientId: userId, leads: null }),

  setStatus: async (id, status) => {
    set({ error: null })
    try {
      const response = await api(`/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao atualizar lead')
      }
      const updated = (await response.json()) as Lead
      set({
        leads:
          get().leads?.map((lead) => (lead.id === id ? { ...lead, ...updated } : lead)) ??
          null,
      })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao atualizar lead'
      set({ error: message })
      return message
    }
  },

  updateLead: async (id, payload) => {
    set({ error: null })
    try {
      const response = await api(`/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao atualizar lead')
      }
      const updated = (await response.json()) as Lead
      set({
        leads:
          get().leads?.map((lead) => (lead.id === id ? { ...lead, ...updated } : lead)) ??
          null,
      })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao atualizar lead'
      set({ error: message })
      return message
    }
  },

  deleteLead: async (id) => {
    set({ error: null })
    try {
      const response = await api(`/leads/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao excluir lead')
      }
      const current = get()
      const removed = current.leads?.find((lead) => lead.id === id)
      set({
        leads: current.leads?.filter((lead) => lead.id !== id) ?? null,
        clients: removed
          ? current.clients?.map((client) =>
              client.userId === removed.userId
                ? { ...client, total: Math.max(0, client.total - 1) }
                : client,
            ) ?? null
          : current.clients,
      })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao excluir lead'
      set({ error: message })
      return message
    }
  },
}))
