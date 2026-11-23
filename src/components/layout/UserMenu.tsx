import { useNavigate } from 'react-router-dom'
import { LogOut, Settings, UserRound } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { DropdownMenu, type DropdownMenuItem } from '@/components/ui/DropdownMenu'
import { useAuth } from '@/app/providers/AuthProvider'

/** Topbar user menu: profile links + sign out. */
export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const items: DropdownMenuItem[] = [
    {
      label: 'Profile settings',
      icon: <UserRound size={15} aria-hidden="true" />,
      onSelect: () => void navigate('/dashboard/settings'),
    },
    {
      label: 'Preferences',
      icon: <Settings size={15} aria-hidden="true" />,
      onSelect: () => void navigate('/dashboard/settings'),
    },
    {
      label: 'Sign out',
      icon: <LogOut size={15} aria-hidden="true" />,
      tone: 'danger',
      onSelect: () => void logout(),
    },
  ]

  return (
    <DropdownMenu
      label="Account menu"
      align="end"
      items={items}
      trigger={(triggerProps) => (
        <button type="button" className="user-button" {...triggerProps}>
          <Avatar name={user.name} src={user.avatarUrl ?? undefined} size="md" />
          <span className="user-button__meta">
            <span className="user-button__name">{user.name}</span>
            <span className="user-button__role">{user.role}</span>
          </span>
        </button>
      )}
    />
  )
}
