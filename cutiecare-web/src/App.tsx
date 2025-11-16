import { useCallback, useEffect, useState } from 'react'
import { Navbar, type SectionKey } from './components/Navbar'
import { HomeSection } from './sections/Home'
import { DashboardSection } from './sections/Dashboard'
import { ActionsSection } from './sections/Actions'
import { CompanionSection } from './sections/Companion'
import { JournalSection } from './sections/Journal'
import { useAuth } from './context/AuthContext'
import { AuthScreen } from './sections/AuthScreen'
import { supabase } from './lib/supabaseClient'
import type { Mood, MoodEntry } from './types'

const explainSupabaseError = (message: string | null | undefined) => {
  if (!message) return null
  if (message.toLowerCase().includes('row-level security')) {
    return 'Supabase blocked this action because the mood_entries RLS policies are missing. Run the SQL in docs/supabase-policies.md and try again.'
  }
  return message
}

function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('home')
  const { user, loading } = useAuth()
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [moodsLoading, setMoodsLoading] = useState(false)
  const [moodsError, setMoodsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchMoods = async () => {
      if (!user) {
        if (!cancelled) {
          setMoodHistory([])
          setMoodsLoading(false)
          setMoodsError(null)
        }
        return
      }

      if (!supabase) {
        setMoodsError('Supabase client is not configured. Add your environment variables to continue.')
        setMoodHistory([])
        setMoodsLoading(false)
        return
      }

      setMoodsLoading(true)
      setMoodsError(null)

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (error) {
        console.error(error)
        setMoodsError(explainSupabaseError(error.message))
        setMoodHistory([])
      } else {
        setMoodHistory((data || []) as MoodEntry[])
      }

      setMoodsLoading(false)
    }

    fetchMoods()

    return () => {
      cancelled = true
    }
  }, [user])

  const handleCheckIn = useCallback(
    async (mood: Mood, note?: string) => {
      if (!user || !supabase) {
        const message = 'Supabase client is not available. Please try again later.'
        setMoodsError(message)
        throw new Error(message)
      }

      setMoodsError(null)

      const sanitizedNote = note?.trim() ? note.trim() : undefined

      const optimistic: MoodEntry = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        user_id: user.id,
        mood,
        note: sanitizedNote ?? null,
      }

      setMoodHistory((prev) => [optimistic, ...prev])

      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood,
          note: sanitizedNote ?? null,
        })
        .select()
        .single()

      if (error) {
        console.error(error)
        setMoodHistory((prev) => prev.filter((entry) => entry.id !== optimistic.id))
        const friendly = explainSupabaseError(error.message) ?? error.message
        setMoodsError(friendly)
        throw new Error(friendly)
      }

      const inserted = data as MoodEntry
      setMoodHistory((prev) => {
        const withoutOptimistic = prev.filter((entry) => entry.id !== optimistic.id)
        return [inserted, ...withoutOptimistic]
      })
    },
    [user],
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection onCheckIn={handleCheckIn} moodError={moodsError} />
      case 'dashboard':
        return <DashboardSection moodHistory={moodHistory} loading={moodsLoading} error={moodsError} />
      case 'actions':
        return <ActionsSection />
      case 'companion':
        return <CompanionSection moodHistory={moodHistory} loading={moodsLoading} />
      case 'journal':
        return <JournalSection />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-sky-50 to-violet-50 flex items-center justify-center px-4">
        <div className="text-center space-y-2 text-slate-600">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">cutiecare</p>
          <p className="text-2xl font-semibold text-slate-800">CutieCare is getting ready…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-sky-50 to-violet-50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        <header className="flex justify-center">
          <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
        </header>

        <main>{renderSection()}</main>
      </div>
    </div>
  )
}

export default App
