interface Contributor {
  id: string
  name: string
  className: string
  avatar?: string
}

const mockContributors: Contributor[] = [
  {
    id: '1',
    name: 'Ethan Carter',
    className: 'Class of 2024',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJb1Bib67ctkGKyLjwFTcanidSQ8wrVuDUdOU-JWlkJlxl28al5otMehiv4LI4sBlvFIWUb4l_nK1bsqX8LfqQCFTRJqa_TxoaQLOMaBWILO8ALxz0twASKgYcTm81GswHda5wXhU1wW3FnhfTl8J3_reptUr_lenTv7GZoxDzLxveoT70El1k-KZ50mhn2uLb3J0eZvK5rx4U9X8LcyOqwg6DjwCZS_wEE6eZXXSHURdwk8aU7daACxXpqoTQc0wwS0gkJgAutpw'
  },
  {
    id: '2',
    name: 'Olivia Bennett',
    className: 'Class of 2025',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd-CgLPC1pFCh56p-f4k91GKSWRcY0lQZBNpumpsKDgKuQP2AmsFbVbx1IMrzo5Jw1MQbmS_2dXhT9iqerQAk2nwGAbZxy0W4n7ZG6_Q-SVYCbRpE1gPQA7Eb4KIGprqegSKeIWXWPIBKkRB2QhOwYN77aDxgkIs1jsvy0w-WJFiCMWVrOpMZaBfwkgFO5mzlVWJAR2_P_wm8Tis6Xp8EMorVB65qwyNTjwmMu6oS0wMozdr_P6L9JhV6aWjFmc6GHHOmxKGfuDrc'
  },
  {
    id: '3',
    name: 'Noah Thompson',
    className: 'Class of 2026',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk9cwCH6K74-0HXoCLniVdAKa708NT31_qYSNAa-MxbzOoSOZU8WPAxooYFPQrVr8Zqn6w6EJ7_dWHlxn-ipz_X_2kcVmBdv5_quc0c5FNX0b6zj9VODYNhZ3i3HVijldC4kxi6qGnihfHhVmlnkleqiGIvjRUmdhbjXyui4OGfuUH4IDm0tPC95kyFmdQg7afiFoKg_iUp2BNQuZibhvKMMR7auWeSYLSj0ylp-1s1vOJOdtZGEw4FiAYKKE6IKwPh3pFEnZeujk'
  }
]

export function TopContributors() {
  return (
    <section>
      <h3 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-4">
        Top Contributors
      </h3>
      <div className="flex flex-col gap-4 px-4">
        {mockContributors.map((contributor, index) => (
          <div
            key={contributor.id}
            className="flex items-center gap-4 p-3 rounded-md hover:bg-[#192633] transition-colors cursor-pointer"
          >
            <div
              className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-full"
              style={{
                backgroundImage: `url("${contributor.avatar}")`
              }}
            ></div>
            <div>
              <p className="text-white font-semibold">{contributor.name}</p>
              <p className="text-gray-400 text-sm">{contributor.className}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
