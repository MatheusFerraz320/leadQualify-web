import {
  BarChart3,
  Briefcase,
  CircleUser,
  ClipboardList,
  Download,
  Handshake,
  Home,
  Inbox,
  LayoutDashboard,
  List,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  UserCog,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type SidebarItem = {
  label: string
  icon: LucideIcon
  to?: string
  query?: string
  placeholder?: boolean
}

export type SidebarSection = {
  title: string
  items: SidebarItem[]
}

export type ModuleConfig = {
  id: string
  label: string
  to: string
  icon: LucideIcon
  adminOnly?: boolean
}

export const navModules: ModuleConfig[] = [
  { id: 'dashboard', label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', to: '/leads', icon: Inbox },
  {
    id: 'collaborators',
    label: 'Colaboradores',
    to: '/collaborator',
    icon: UserPlus,
    adminOnly: true,
  },
  { id: 'profile', label: 'Meu Perfil', to: '/minha-conta', icon: CircleUser },
]

export const fallbackSections: SidebarSection[] = [
  {
    title: 'Acesso rápido',
    items: [
      { label: 'Dashboard', icon: Home, to: '/' },
      { label: 'Meu Perfil', icon: CircleUser, to: '/minha-conta' },
    ],
  },
]

const sidebarSections: Record<string, SidebarSection[]> = {
  leads: [
    {
      title: 'Leads',
      items: [
        { label: 'Todos os Leads', icon: List, to: '/leads' },
        { label: 'Novos Leads', icon: Sparkles, to: '/leads', query: 'status=PENDING' },
        { label: 'Em Negociação', icon: Handshake, placeholder: true },
        { label: 'Ganhos', icon: Target, to: '/leads', query: 'status=APPROVED' },
        { label: 'Perdidos', icon: BarChart3, to: '/leads', query: 'status=REJECTED' },
      ],
    },
    {
      title: 'Ações rápidas',
      items: [
        { label: 'Importar Leads', icon: Upload, placeholder: true },
        { label: 'Exportar', icon: Download, placeholder: true },
        { label: 'Relatórios', icon: ClipboardList, placeholder: true },
      ],
    },
  ],
  collaborators: [
    {
      title: 'Colaboradores',
      items: [
        { label: 'Lista Geral', icon: Users, to: '/collaborator' },
        { label: 'Adicionar Novo', icon: UserPlus, to: '/register' },
        { label: 'Cargos', icon: UserCog, placeholder: true },
        { label: 'Permissões', icon: ShieldCheck, placeholder: true },
        { label: 'Equipes', icon: Briefcase, placeholder: true },
      ],
    },
    {
      title: 'Performance',
      items: [
        { label: 'Metas', icon: Target, placeholder: true },
        { label: 'Avaliações', icon: ClipboardList, placeholder: true },
      ],
    },
  ],
}

export function getModuleId(pathname: string): string | null {
  if (pathname === '/' || pathname === '') return 'dashboard'
  if (pathname.startsWith('/leads')) return 'leads'
  if (pathname.startsWith('/collaborator') || pathname.startsWith('/register')) {
    return 'collaborators'
  }
  if (pathname.startsWith('/minha-conta')) return 'profile'
  return null
}

export function getSectionsForModule(moduleId: string | null): SidebarSection[] {
  if (!moduleId) return fallbackSections
  return sidebarSections[moduleId] ?? fallbackSections
}
