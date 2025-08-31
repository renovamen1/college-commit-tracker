'use client'

import { Bell, Search } from 'lucide-react'

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
  return (
    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{
      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJb1Bib67ctkGKyLjwFTcanidSQ8wrVuDUdOU-JWlkJlxl28al5otMehiv4LI4sBlvFIWUb4l_nK1bsqX8LfqQCFTRJqa_TxoaQLOMaBWILO8ALxz0twASKgYcTm81GswHda5wXhU1wW3FnhfTl8J3_reptUr_lenTv7GZoxDzLxveoT70El1k-KZ50mhn2uLb3J0eZvK5rx4U9X8LcyOqwg6DjwCZS_wEE6eZXXSHURdwk8aU7daACxXpqoTQc0wwS0gkJgAutpw")`
    }}></div>
  )
}
