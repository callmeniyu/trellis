import { Link } from 'react-router-dom'
import {
  FolderPlus,
  PackagePlus,
  ReceiptText,
  ShoppingCart,
  UserPlus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface QuickAction {
  label: string
  to: string
  icon: LucideIcon
}

const ACTIONS: QuickAction[] = [
  { label: 'Add user', to: '/dashboard/users?create=1', icon: UserPlus },
  { label: 'New product', to: '/dashboard/products?create=1', icon: PackagePlus },
  { label: 'New project', to: '/dashboard/projects?create=1', icon: FolderPlus },
  { label: 'View orders', to: '/dashboard/orders', icon: ShoppingCart },
  { label: 'Invoices', to: '/dashboard/invoices', icon: ReceiptText },
]

/** Shortcut tiles for the most common admin tasks. */
export function QuickActions() {
  return (
    <nav aria-label="Quick actions" className="quick-actions">
      {ACTIONS.map((action) => (
        <Link key={action.label} to={action.to} className="quick-action">
          <span className="quick-action__icon">
            <action.icon size={15} aria-hidden="true" />
          </span>
          {action.label}
        </Link>
      ))}
    </nav>
  )
}
