import { create } from 'zustand'
import { api, getErrorMessage } from '../lib/api'
import type { LeadStatus } from './leadsStore'

export type DashboardTotals = {
  total: number
  pending: number
  approved: number
  rejected: number
  conversionRate: number
  newThisMonth: number
  previousMonth: number
  monthDeltaPct: number
}

export type StatusCount = { status: LeadStatus; count: number }

export type MonthlyPoint = { month: string; count: number }

export type LabelCount = { label: string; count: number }

export type UserRanking = {
  userId: string
  user: { id: string; name: string; email: string } | null
  total: number
  pending: number
  approved: number
  rejected: number
  conversionRate: number
}

export type DashboardSummary = {
  totals: DashboardTotals
  byStatus: StatusCount[]
  monthly: MonthlyPoint[]
  byProduct: LabelCount[]
  byCampaign: LabelCount[]
  byUser: UserRanking[]
}

type DashboardState = {
  summary: DashboardSummary | null
  loading: boolean
  error: string | null
  fetchSummary: (userId?: string) => Promise<string | null>
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  summary: null,
  loading: false,
  error: null,

  fetchSummary: async (userId) => {
    set({ loading: true, error: null })
    try {
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : ''
      const response = await api(`/dashboard/summary${query}`)
      if (!response.ok) {
        const message = await getErrorMessage(response)
        throw new Error(message || 'Erro ao carregar métricas')
      }
      set({ summary: (await response.json()) as DashboardSummary, loading: false })
      return null
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar métricas'
      set({ summary: null, loading: false, error: message })
      return message
    }
  },
}))
