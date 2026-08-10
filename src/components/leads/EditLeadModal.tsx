import { useState } from 'react'
import {
  Building2,
  ChevronDown,
  Loader2,
  Mail,
  Package,
  Phone,
  Save,
  Tag,
  User as UserIcon,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'
import { useLeadsStore, type Lead } from '../../stores/leadsStore'

type Props = {
  lead: Lead
  onClose: () => void
}

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-slate-900'

const statusOptions: Array<{ value: Lead['status']; label: string }> = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'APPROVED', label: 'Aprovado' },
  { value: 'REJECTED', label: 'Reprovado' },
]

export function EditLeadModal({ lead, onClose }: Props) {
  const updateLead = useLeadsStore((state) => state.updateLead)
  const [name, setName] = useState(lead.name)
  const [email, setEmail] = useState(lead.email ?? '')
  const [phone, setPhone] = useState(lead.phone)
  const [product, setProduct] = useState(lead.product)
  const [finality, setFinality] = useState(lead.finality)
  const [status, setStatus] = useState<Lead['status']>(lead.status)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) {
      toast.error('Preencha o nome do lead')
      return
    }

    setSaving(true)
    const updateError = await updateLead(lead.id, {
      name: name.trim(),
      email: email.trim() || undefined,
      phone,
      product,
      finality,
      status,
    })
    setSaving(false)

    if (updateError) {
      toast.error(updateError)
    } else {
      toast.success('Lead atualizado com sucesso!')
      onClose()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editar lead"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-slate-200/70 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/50">
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

        <div className="p-7 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Editar lead
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Atualize os dados de {lead.name}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="lead-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Nome
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="lead-name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lead-email"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="lead-phone"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="lead-phone"
                    type="text"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lead-product"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Produto / Serviço
                </label>
                <div className="relative">
                  <Package className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="lead-product"
                    type="text"
                    value={product}
                    onChange={(event) => setProduct(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="lead-finality"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Finalidade
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <input
                    id="lead-finality"
                    type="text"
                    value={finality}
                    onChange={(event) => setFinality(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lead-status"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Status
                </label>
                <div className="relative">
                  <Tag className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-600/70 dark:text-cyan-400/70" />
                  <select
                    id="lead-status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as Lead['status'])
                    }
                    className={cn(inputClass, 'appearance-none pr-10')}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
