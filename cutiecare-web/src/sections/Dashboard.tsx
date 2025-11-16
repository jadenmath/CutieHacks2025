import { useMemo } from 'react'
import { Card } from '../components/Card'
import type { MoodEntry } from '../types'

type DashboardSectionProps = {
  moodHistory: MoodEntry[]
  loading: boolean
  error: string | null
}

export function DashboardSection({ moodHistory, loading, error }: DashboardSectionProps) {
  const totalCheckIns = moodHistory.length

  const mostFrequentMood = useMemo(() => {
    if (!moodHistory.length) return null
    const counts = moodHistory.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }, [moodHistory])

  if (loading) {
    return (
      <section className="space-y-6 md:space-y-8">
        <Card className="text-center text-slate-600">Loading your check-ins…</Card>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-6 md:space-y-8">
        <Card className="text-center text-pink-600">{error}</Card>
      </section>
    )
  }

  if (!totalCheckIns) {
    return (
      <section className="space-y-6 md:space-y-8">
        <Card className="text-center text-slate-600">Cutie is waiting for your first check-in 💕</Card>
      </section>
    )
  }

  const summaryText = mostFrequentMood
    ? `You’ve been feeling ${mostFrequentMood.toLowerCase()} more often lately.`
    : 'Cutie will summarize your moods once you log a few check-ins.'

  return (
    <section className="space-y-6 md:space-y-8">
      <Card className="hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-slate-900">Your mood at a glance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/70 border border-slate-100 px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-slate-400">Total check-ins</p>
              <p className="text-3xl font-semibold text-slate-900">{totalCheckIns}</p>
            </div>
            <div className="rounded-2xl bg-white/70 border border-slate-100 px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-slate-400">Most frequent mood</p>
              <p className="text-xl font-semibold text-pink-600">{mostFrequentMood ?? '—'}</p>
            </div>
            <div className="rounded-2xl bg-white/70 border border-slate-100 px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-slate-400">Streak</p>
              <p className="text-xl font-semibold text-slate-900">3 days</p>
              <p className="text-xs text-slate-500">(placeholder)</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">{summaryText}</p>
        </div>
      </Card>

      <Card className="hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-slate-900">Recent check-ins</h3>
          <div className="divide-y divide-slate-100">
            {moodHistory.map((entry) => (
              <div key={entry.id} className="flex items-start justify-between gap-3 py-3">
                <div className="space-y-1">
                  <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
                    {entry.mood}
                  </span>
                  {entry.note && <p className="text-sm text-slate-600">{entry.note}</p>}
                </div>
                <p className="text-xs text-slate-400">
                  {new Date(entry.created_at).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  )
}
