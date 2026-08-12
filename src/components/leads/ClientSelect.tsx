import { useState } from 'react'
import { Building2, Check, ChevronDown, Loader2, RefreshCw, Users } from 'lucide-react'
import { cn, initials } from '../../lib/utils'
import type { ClientSummary } from '../../stores/leadsStore'

type Props = {
  clients: ClientSummary[] | null
  selectedClientId: string | null
  loading: boolean
  error: string | null
  onSelect: (userId: string | null) => void
  onRetry: () => void
}

export function ClientSelect({
  clients,
  selectedClientId,
  loading,
  error,
  onSelect,
  onRetry,
}: Props) {
  const [open, setOpen] = useState(false)

  const selected =
    selectedClientId === null
      ? null
      : clients?.find((client) => client.userId === selectedClientId) ?? null

  const close = () => setOpen(false)

  const optionClass = (active: boolean) =>
    cn(
      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition',
      active
        ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-slate-700/70 dark:text-indigo-300'
        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50',
    )

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-11 max-w-60 items-center gap-2 rounded-xl 
        border border-slate-200 bg-white py-0 pr-3 pl-1.5 
        text-sm font-medium text-slate-700 shadow-sm 
        transition hover:border-indigo-300 hover:text-slate-900 
        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 
        dark:hover:border-indigo-500/60 dark:hover:text-white mx-13"
      >
        {selected ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white">
            {initials(selected.user?.name ?? '')}
          </span>
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300">
            <Users className="h-4 w-4" strokeWidth={1.75} />
          </span>
        )}
        <span className="truncate">
          {selected
            ? selected.user?.name ?? 'Cliente'
            : 'Todos os clientes'}
        </span>
        <ChevronDown
          className={cn(
            'ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500',
            open && 'rotate-180',
          )}
          strokeWidth={2}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <div
            role="listbox"
            aria-label="Selecionar cliente"
            className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40"
          >
            <p className="flex items-center gap-1.5 px-3 pt-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Clientes
            </p>

            {loading && clients === null ? (
              <div className="flex items-center justify-center gap-2 px-3 py-8">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Carregando clientes...
                </span>
              </div>
            ) : error && clients === null ? (
              <div className="flex flex-col items-center gap-2.5 px-3 py-6 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
                <button
                  onClick={onRetry}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Tentar novamente
                </button>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto pb-1">
                <button
                  role="option"
                  aria-selected={selectedClientId === null}
                  onClick={() => {
                    onSelect(null)
                    close()
                  }}
                  className={cn(optionClass(selectedClientId === null), 'mt-1')}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                      selectedClientId === null
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300',
                    )}
                  >
                    <Users className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">Todos os clientes</span>
                  {selectedClientId === null && (
                    <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
                  )}
                </button>

                {clients?.map((client) => {
                  const active = client.userId === selectedClientId
                  return (
                    <button
                      key={client.userId}
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onSelect(client.userId)
                        close()
                      }}
                      className={optionClass(active)}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                          active
                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300',
                        )}
                      >
                        {initials(client.user?.name ?? '')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {client.user?.name ?? 'Cliente'}
                        </span>
                        <span className="block truncate text-[11px] text-slate-400 dark:text-slate-500">
                          {client.total} {client.total === 1 ? 'lead' : 'leads'}
                        </span>
                      </span>
                      {active && <Check className="h-4 w-4 shrink-0" strokeWidth={2} />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
