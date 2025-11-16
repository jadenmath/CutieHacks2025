type MoodPillProps = {
  label: string
  selected?: boolean
  onClick?: () => void
}

export function MoodPill({ label, selected = false, onClick }: MoodPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-4 py-1.5 rounded-full border text-xs md:text-sm cursor-pointer border-pink-200/60 bg-white/70 text-slate-700 hover:bg-pink-50 hover:border-pink-300 transition-all duration-150 ${
        selected
          ? 'bg-pink-500 text-white border-pink-500 shadow-[0_8px_22px_rgba(236,72,153,0.5)] transform scale-[1.03]'
          : ''
      }`}
    >
      {label}
    </button>
  )
}
