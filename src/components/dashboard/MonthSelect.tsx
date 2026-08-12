import { useState } from 'react'
import { CalendarDays, Check, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

type Props = {
  months: string[]
  selectedMonth: string | null
  onSelect: (month: string | null) => void
}

const shortMonths = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

function formatMonthKey(key: string) {
  const [year, month] = key.split('-')
  const label = shortMonths[Number(month) - 1] ?? month
  return `${label}/${year.slice(2)}`
}

export function MonthSelect({ months, selectedMonth, onSelect }: Props) {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  const optionClass = (active: boolean) =>
    cn(
      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition',
      active
        ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-slate-700/70 dark:text-indigo-300'
        : 'text-slate-600 hover:bg-slate-50 dark:text-white dark:hover:bg-slate-700/50',
    )

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-11 max-w-60 items-center gap-2 rounded-xl border border-slate-200 bg-white py-0 pr-3 pl-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-indigo-500/60 dark:hover:text-white"
      >
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            selectedMonth
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
              : 'bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300',
          )}
        >
          <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="truncate">
          {selectedMonth ? formatMonthKey(selectedMonth) : 'Todos os meses'}
        </span>
        <ChevronDown
          className={cn(
            'ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-white',
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
            aria-label="Selecionar mês"
            className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40"
          >
            <button
              role="option"
              aria-selected={selectedMonth === null}
              onClick={() => {
                onSelect(null)
                close()
              }}
              className={cn(optionClass(selectedMonth === null), 'mt-1')}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  selectedMonth === null
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-white',
                )}
              >
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1 truncate">Todos os meses</span>
              {selectedMonth === null && (
                <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
              )}
            </button>

            <div className="max-h-80 overflow-y-auto pb-1">
              {months.map((month) => {
                const active = month === selectedMonth
                return (
                  <button
                    key={month}
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onSelect(month)
                      close()
                    }}
                    className={optionClass(active)}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                        active
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-white',
                      )}
                    >
                      {formatMonthKey(month).slice(0, 3)}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {formatMonthKey(month)}
                    </span>
                    {active && (
                      <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
