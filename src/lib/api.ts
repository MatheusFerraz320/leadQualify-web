import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function api(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    })
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(
        'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      )
    }
    throw err
  }

  if (response.status === 401 && !path.startsWith('/auth/')) {
    useAuthStore.getState().handleUnauthorized()
  }

  return response
}

type ErrorBody = { message?: string | string[] }

export async function getErrorMessage(response: Response): Promise<string> {
  if (response.status >= 500) return 'Erro interno do servidor'
  try {
    const body = (await response.json()) as ErrorBody
    if (Array.isArray(body?.message)) return body.message[0] ?? 'Erro inesperado'
    if (typeof body?.message === 'string') return body.message
  } catch {
    // response sem corpo JSON
  }
  return response.ok? '' : `Erro inesperado (${response.status})`
}
