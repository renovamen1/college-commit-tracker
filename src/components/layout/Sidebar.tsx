import { Home, Trophy, Building, User, Settings } from 'lucide-react'

interface SidebarProps {
  activeItem?: 'home' | 'leaderboard' | 'departments' | 'profile' | 'settings'
}

export function Sidebar({ activeItem = 'profile' }: SidebarProps) {
  const navItems = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home,
      href: '/admin'
    },
    {
      id: 'leaderboard' as const,
      label: 'Leaderboard',
      icon: Trophy,
      href: '/admin/leaderboard'
    },
    {
      id: 'departments' as const,
      label: 'Departments',
      icon: Building,
      href: '/admin/departments'
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
      href: '/profile'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      href: '/settings'
    }
  ]

  return (
    <div className="flex w-72 flex-col border-r border-gray-800 bg-gray-950 p-4">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-6">
          {/* Profile Header */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0KnE2jd8h3b0pibOe4BArlpWB7LIgOmyO9vBjOLFB6kXPhHvbIV4J7i6PB0wpptddY074exSZivxrA36jGpD9uh7Ed4FWzVhvWi2zSND5WyCWan_jPOk8AXAmGPAwH-6gUxwKwtNTIpoUcEZF0KRGgmIwe2rWA4GPBANO38sxoVTP3AzhNZzgMDf6LQbXpxYbA8KeIX1jl7ZUeR-aa90RRvsx4ft-zec0PKE7vbMM7B16Zq0fJWHndaDabIQp27t2Fd7Yro-1zMA")`
            }}></div>
            <h1 className="text-white text-lg font-bold leading-normal">CodeCommit</h1>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                {...item}
                isActive={activeItem === item.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  id: string
  label: string
  icon: any
  href: string
  isActive: boolean
}

function NavItem({ label, icon: Icon, href, isActive }: NavItemProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-[#1173d4] text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
      <p className="text-sm font-medium leading-normal">{label}</p>
    </a>
  )
}
