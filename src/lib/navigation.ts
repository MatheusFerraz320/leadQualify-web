import {
  CircleUser,
  Inbox,
  LayoutDashboard,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'

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