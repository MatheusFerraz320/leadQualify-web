import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function api(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = useAuthStore.getState().token

  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(`${API_URL}${path}`, { ...options, headers })
}

type ErrorBody = { message?: string | string[] }

export async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ErrorBody
    if (Array.isArray(body?.message)) return body.message[0] ?? 'Erro inesperado'
    if (typeof body?.message === 'string') return body.message
  } catch {
    // response sem corpo JSON
  }
  return response.ok ? '' : `Erro inesperado (${response.status})`
}
