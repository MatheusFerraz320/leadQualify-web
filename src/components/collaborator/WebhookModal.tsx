import { useEffect, useState } from 'react'
import { Check, Copy, Loader2, RefreshCcw, Webhook, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'
import { useUsersStore } from '../../stores/usersStore'
import type { User } from '../../stores/authStore'

type Props = {
  user: User
  onClose: () => void
}

const WEBHOOK_BASE =
  import.meta.env.VITE_WEBHOOK_BASE_URL ?? import.meta.env.VITE_API_URL ?? ''

function buildWebhookUrl(token: string) {
  const base = WEBHOOK_BASE.replace(/\/+$/, '')
  return base
    ? `${base}/webhooks/rdstation/${token}`
    : `/webhooks/rdstation/${token}`
}

export function WebhookModal({ user, onClose }: Props) {
  const { fetchWebhookToken, rotateWebhookToken } = useUsersStore()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    fetchWebhookToken(user.id).then((value) => {
      if (!active) return
      setToken(value)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [user.id, fetchWebhookToken])

  async function handleCopy() {
    if (!token) return
    try {
      await navigator.clipboard.writeText(buildWebhookUrl(token))
      setCopied(true)
      toast.success('URL do webhook copiada!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Não foi possível copiar a URL')
    }
  }

  async function handleRegenerate() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    setRegenerating(true)
    const newToken = await rotateWebhookToken(user.id)
    setRegenerating(false)
    setConfirming(false)
    if (!newToken) {
      toast.error('Erro ao regenerar token')
      return
    }
    setToken(newToken)
    toast.success('Token regenerado com sucesso!')
  }

  const webhookUrl = token ? buildWebhookUrl(token) : ''

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Integração RD Station"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/50">
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

        <div className="p-7 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                <Webhook className="h-5 w-5 text-white" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Integração RD Station
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-white">
                  Webhook de leads de {user.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-white dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
              <span className="text-sm text-slate-500 dark:text-white">
                Carregando token...
              </span>
            </div>
          ) : !token ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <p className="text-sm text-slate-500 dark:text-white">
                Não foi possível carregar o token de webhook.
              </p>
              <button
                onClick={onClose}
                className="rounded-xl bg-cyan-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                Fechar
              </button>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-slate-600 dark:text-white">
                Cole esta URL no webhook do RD Station Marketing para receber
                os leads de {user.name}:
              </p>

              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={webhookUrl}
                  onFocus={(event) => event.target.select()}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-4 font-mono text-xs text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:focus:border-cyan-400 dark:focus:bg-slate-900"
                />
                <button
                  onClick={handleCopy}
                  aria-label="Copiar URL"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white transition hover:bg-cyan-500 active:scale-95"
                >
                  {copied ? (
                    <Check className="h-4.5 w-4.5" strokeWidth={2} />
                  ) : (
                    <Copy className="h-4.5 w-4.5" strokeWidth={2} />
                  )}
                </button>
              </div>

              {!WEBHOOK_BASE && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  Configure <code className="font-mono">VITE_WEBHOOK_BASE_URL</code>{' '}
                  (ou <code className="font-mono">VITE_API_URL</code>) com a URL
                  pública da API para exibir a URL completa.
                </p>
              )}

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">
                    Token de webhook
                  </p>
                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                      confirming
                        ? 'bg-rose-600 text-white hover:bg-rose-500'
                        : 'text-cyan-700 ring-1 ring-cyan-200 hover:bg-cyan-50 dark:text-cyan-300 dark:ring-cyan-500/30 dark:hover:bg-cyan-500/10',
                    )}
                  >
                    {regenerating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                    {confirming ? 'Confirmar?' : 'Regenerar'}
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-white">
                  Regenerar invalida a URL atual. Atualize o webhook no RD
                  Station após regenerar.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
