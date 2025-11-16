import { type ReactNode } from 'react'
import { Card } from '../components/Card'
import type { MoodEntry } from '../types'

const profileTraits = [
  { label: 'Energy', value: 'Medium' },
  { label: 'Calm', value: 'High' },
  { label: 'Hope', value: 'Growing' },
  { label: 'Focus', value: 'In progress' },
]

const moodTips: Record<string, string> = {
  Stressed: 'Let’s unclench your jaw, drop your shoulders, and take three grounding breaths.',
  Happy: 'Bottle this sunshine by jotting one sweet detail from today.',
  Tired: 'Maybe Cutie can guard a 15-minute power nap for you?',
  Anxious: 'Try the 5-4-3-2-1 exercise or message a friend for a mini grounding chat.',
  Excited: 'Channel that spark into a tiny action that future-you will appreciate.',
  Meh: 'Soft days count too—maybe a cozy beverage while you reset?'
}

function getMoodSuggestion(mood: string) {
  return moodTips[mood] ?? 'Cutie is always here—share a check-in to unlock a fresh suggestion.'
}

type CompanionSectionProps = {
  moodHistory: MoodEntry[]
  loading: boolean
}

export function CompanionSection({ moodHistory, loading }: CompanionSectionProps) {
  let content: ReactNode

  if (loading) {
    content = <p className="text-sm text-slate-600">Cutie is checking your recent vibes…</p>
  } else if (!moodHistory.length) {
    content = <p className="text-sm text-slate-600">We don’t have any check-ins yet. Start on the Home page!</p>
  } else {
    const latest = moodHistory[0]
    content = (
      <>
        <p className="text-xs uppercase tracking-widest text-pink-500 mb-1">today’s vibe</p>
        <p className="text-lg font-semibold text-slate-900">Today you’re feeling {latest.mood}</p>
        {latest.note && <p className="text-sm text-slate-600">{latest.note}</p>}
        <p className="mt-3 text-sm text-pink-600">{getMoodSuggestion(latest.mood)}</p>
      </>
    )
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <Card className="hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-4xl text-white shadow-xl mx-auto">
            ✨
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-slate-900">Your Cutie companion</h3>
            <p className="text-sm text-slate-600">
              A gentle buddy that mirrors your energy and reminds you to choose softness throughout the day.
            </p>
          </div>

          <div className="rounded-3xl bg-white/70 border border-pink-100 px-4 py-4 text-left">
            {content}
          </div>
        </div>
      </Card>

      <Card className="hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200">
        <div className="space-y-3">
          <h4 className="text-xl font-semibold text-slate-900">Companion profile</h4>
          <p className="text-sm text-slate-600">Cutie evolves with your reflections. Here’s the current aura snapshot.</p>
          <div className="flex flex-wrap gap-3">
            {profileTraits.map((trait) => (
              <span
                key={trait.label}
                className="inline-flex items-center rounded-full bg-pink-50 text-pink-700 px-3 py-1 text-xs font-medium"
              >
                {trait.label}: {trait.value}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </section>
  )
}
