'use client'

import { Bell, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock authentication hook - replace with real auth later
function useAuth() {
  // For demo: setting to true (logged in) by default
  // In a real app, this would come from a context, auth store, or API
  const isLoggedIn = typeof window !== 'undefined' ?
    localStorage.getItem('isLoggedIn') === 'true' : false

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true')
    return true
  }

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    return false
  }

  return { isLoggedIn, login, logout }
}

export function HoverNotifications() {
  return (
    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-[#192633] text-gray-400 hover:text-white transition-colors">
      <Bell size={20} />
    </button>
  )
}

export function SearchIcon() {
  return (
    <div className="text-[#92adc9]">
      <Search size={20} />
    </div>
  )
}

export function ProfileAvatar() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // User is logged in, go to profile page
      router.push('/home/profile')
    } else {
      // User not logged in, go to login page on landing page
      router.push('/login')
    }
  }

  return (
    <button
      onClick={handleProfileClick}
      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 hover:opacity-80 transition-opacity cursor-pointer"
      style={{
        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJb1Bib67ctkGKyLjwFTcanidSQ8wrVuDUdOU-JWlkJlxl28al5otMehiv4LI4sBlvFIWUb4l_nK1bsqX8LfqQCFTRJqa_TxoaQLOMaBWILO8ALxz0twASKgYcTm81GswHda5wXhU1wW3FnhfTl8J3_reptUr_lenTv7GZoxDzLxveoT70El1k-KZ50mhn2uLb3J0eZvK5rx4U9X8LcyOqwg6DjwCZS_wEE6eZXXSHURdwk8aU7daACxXpqoTQc0wwS0gkJgAutpw")`
      }}
      title={isLoggedIn ? "View Profile" : "Login to view profile"}
    >
    </button>
  )
}
