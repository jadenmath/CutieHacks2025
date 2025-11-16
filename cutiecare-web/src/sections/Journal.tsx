import { useState } from 'react'
import { Card } from '../components/Card'
import { PrimaryButton } from '../components/PrimaryButton'

export function JournalSection() {
  const [entry, setEntry] = useState('')
  const [promptText, setPromptText] = useState('')
  const [summaryText, setSummaryText] = useState('')

  const handlePrompt = () => {
    setPromptText('Cutie would suggest writing about what made today feel heavy and what felt like a tiny spark.')
  }

  const handleSummary = () => {
    setSummaryText('Placeholder summary: Cutie hears themes of resilience, curiosity, and a need for gentler pacing.')
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <Card className="hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Quiet corner</h3>
            <p className="text-sm text-slate-600">A private nook for unfiltered feelings, gratitudes, or the messy in-between moments.</p>
          </div>

          <textarea
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            placeholder="What’s taking up space in your mind right now?"
            className="w-full min-h-[200px] rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition"
          />

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              <PrimaryButton onClick={handlePrompt}>Get AI prompt (placeholder)</PrimaryButton>
              <button
                type="button"
                onClick={handleSummary}
                className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-pink-200 text-xs md:text-sm text-pink-600 bg-white/70 hover:bg-pink-50 transition"
              >
                Summarize (placeholder)
              </button>
            </div>
            <p className="text-xs text-slate-400">Entries stay on your device during this mission.</p>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            {promptText && <p className="text-pink-600">{promptText}</p>}
            {summaryText && <p className="text-emerald-600">{summaryText}</p>}
          </div>
        </div>
      </Card>
    </section>
  )
}
