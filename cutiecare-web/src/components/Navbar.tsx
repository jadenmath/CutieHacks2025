import { useAuth } from '../context/AuthContext'

type SectionKey = 'home' | 'dashboard' | 'actions' | 'companion' | 'journal'

type NavbarProps = {
  activeSection: SectionKey
  onSectionChange: (section: SectionKey) => void
}

const tabs: { label: string; key: SectionKey }[] = [
  { label: 'Home', key: 'home' },
  { label: 'Dashboard', key: 'dashboard' },
  { label: 'Actions', key: 'actions' },
  { label: 'Companion', key: 'companion' },
  { label: 'Journal', key: 'journal' },
]

export function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  const { user, signOut } = useAuth()
  const displayEmail = user?.email ?? 'Account'

  return (
    <nav className="flex items-center gap-4 bg-white/80 backdrop-blur-lg rounded-full shadow-lg px-3 py-2 md:px-5 md:py-2.5">
      <div className="inline-flex items-center gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === activeSection
          return (
            <button
              key={tab.key}
              onClick={() => onSectionChange(tab.key)}
              className={`text-sm md:text-base font-medium transition rounded-full px-3 py-1.5 md:px-4 md:py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60 ${
                isActive
                  ? 'bg-pink-500 text-white shadow-[0_8px_20px_rgba(236,72,153,0.35)]'
                  : 'text-slate-600 hover:bg-pink-50'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {user && (
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
          <span className="hidden sm:inline text-slate-500">{displayEmail}</span>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 text-xs md:text-sm text-slate-600 hover:bg-slate-200 transition"
          >
            <span className="hidden sm:inline">Sign out</span>
            <span className="sm:hidden">⏏</span>
          </button>
        </div>
      )}
    </nav>
  )
}

export type { SectionKey }
