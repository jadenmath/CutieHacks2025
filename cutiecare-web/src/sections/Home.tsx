import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { PrimaryButton } from '../components/PrimaryButton'
import { MoodPill } from '../components/MoodPill'
import { ChatCheckIn } from '../components/ChatCheckIn'
import type { Mood } from '../types'

const moods: Mood[] = ['Happy', 'Tired', 'Stressed', 'Anxious', 'Excited', 'Meh']

type HomeProps = {
  onCheckIn: (mood: Mood, note?: string) => Promise<void> | void
  moodError?: string | null
}

export function HomeSection({ onCheckIn, moodError }: HomeProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [localError, setLocalError] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!statusMessage) return
    const timeout = setTimeout(() => setStatusMessage(null), 3500)
    return () => clearTimeout(timeout)
  }, [statusMessage])

  const handleStartChat = () => {
    if (!selectedMood) {
      setLocalError('Choose a mood so Cutie knows how you feel today.')
      return
    }
    setLocalError('')
    setChatOpen(true)
  }

  useEffect(() => {
    if (selectedMood) {
      setLocalError('')
    }
  }, [selectedMood])

  const displayError = moodError || localError

  return (
    <section className="space-y-6 md:space-y-8">
      <Card className="hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-pink-500">daily ritual</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">How are you feeling today?</h2>
            <p className="text-base text-slate-600 max-w-2xl">
              Let’s pause for a moment of care. Capture how you feel, add a tiny note through Cutie, and keep your wellbeing
              in focus.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="flex-1 space-y-3">
              <p className="text-sm font-medium text-slate-700">Pick a mood that fits your vibe:</p>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <MoodPill
                    key={mood}
                    label={mood}
                    selected={mood === selectedMood}
                    onClick={() => setSelectedMood(mood)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto space-y-2">
              <PrimaryButton className="w-full md:w-auto" onClick={handleStartChat} disabled={submitting}>
                Talk to Cutie
              </PrimaryButton>
              {displayError && <p className="text-sm text-pink-600">{displayError}</p>}
              {statusMessage && !displayError && <p className="text-xs text-emerald-600">{statusMessage}</p>}
              {submitting && <p className="text-xs text-slate-500">Cutie is saving your reflection…</p>}
            </div>
          </div>
        </div>
      </Card>

      <ChatCheckIn
        open={chatOpen}
        mood={selectedMood}
        onClose={() => setChatOpen(false)}
        onComplete={async (mood, summary) => {
          setSubmitting(true)
          try {
            await onCheckIn(mood, summary)
            setStatusMessage('Cutie saved today’s check-in 💖')
            setSelectedMood(null)
          } catch (error) {
            console.error(error)
            setLocalError('Could not save your check-in. Please try again.')
          } finally {
            setSubmitting(false)
          }
        }}
      />
    </section>
  )
}
