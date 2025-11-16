import { FormEvent, useEffect, useRef, useState } from 'react'
import type { Mood, ChatMessage } from '../types'
import { MessageBubble } from './MessageBubble'

type ChatCheckInProps = {
  open: boolean
  mood: Mood | null
  onClose: () => void
  onComplete: (mood: Mood, summary: string) => Promise<void> | void
}

const getInitialCutieGreeting = (mood: Mood): string => {
  switch (mood) {
    case 'Stressed':
      return 'Hey friend, let’s slow down together. What’s weighing on you today?'
    case 'Happy':
      return 'Sparkles detected! Tell me what’s making your heart light right now.'
    case 'Tired':
      return 'Cutie brought a cozy blanket. What’s been draining your energy?'
    case 'Anxious':
      return 'I’m here and grounding with you. What thoughts are looping right now?'
    case 'Excited':
      return 'Eeee! Share all the details so we can celebrate properly.'
    case 'Meh':
      return 'Soft days count too. Want to vent a little or just describe the vibe?'
    default:
      return 'How are you feeling in this moment? I’m listening.'
  }
}

export function ChatCheckIn({ open, mood, onClose, onComplete }: ChatCheckInProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [ending, setEnding] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open || !mood) return
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: 'cutie',
        text: getInitialCutieGreeting(mood),
        timestamp: new Date().toISOString(),
      },
    ])
    setInput('')
    setEnding(false)
    setSending(false)
    setError(null)
  }, [open, mood])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!open || !mood) return null

  const mapMessagesForApi = (items: ChatMessage[]) =>
    items.map(({ sender, text, timestamp }) => ({ sender, text, timestamp }))

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!input.trim() || !mood || sending || ending) return

    setError(null)

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setSending(true)

    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          messages: mapMessagesForApi(updatedMessages),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = (await response.json()) as { reply?: string }
      const replyText = (data.reply ?? '').trim()
      if (!replyText) {
        throw new Error('Empty reply from Gemini')
      }

      const cutieMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'cutie',
        text: replyText,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, cutieMsg])
    } catch (fetchError) {
      console.error(fetchError)
      setError('Cutie had trouble responding. You can keep sharing or end this check-in whenever you’re ready.')
    } finally {
      setSending(false)
    }
  }

  const handleEndClick = async () => {
    if (!mood) {
      onClose()
      return
    }

    if (!messages.length) {
      onClose()
      return
    }

    setError(null)
    setEnding(true)

    try {
      const response = await fetch('/api/gemini-summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          messages: mapMessagesForApi(messages),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = (await response.json()) as { summary?: string }
      const summary = (data.summary ?? '').trim()
      if (!summary) {
        throw new Error('Empty summary from Gemini')
      }

      await onComplete(mood, summary)
      onClose()
    } catch (fetchError) {
      console.error(fetchError)
      setError('Cutie had trouble summarizing this check-in. You can try again or save without a summary.')
    } finally {
      setEnding(false)
    }
  }

  const isInputDisabled = ending || sending
  const isSendDisabled = isInputDisabled || !input.trim()

  const renderStatus = () => {
    if (ending) return 'Cutie is saving your reflection…'
    if (sending) return 'Cutie is thinking…'
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl h-[90vh] md:rounded-3xl bg-white/90 backdrop-blur-xl shadow-[0_24px_80px_rgba(15,23,42,0.45)] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white text-xl shadow-md">
              💖
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Chat with Cutie</p>
              <p className="text-xs text-slate-500">
                Mood: <span className="font-medium">{mood}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleEndClick}
            disabled={ending || sending}
            className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-pink-200 text-pink-600 bg-white hover:bg-pink-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {ending ? 'Wrapping up…' : 'End check-in'}
          </button>
        </div>

        {error && (
          <div className="px-4 py-2 text-xs text-rose-600 bg-rose-50 border-y border-rose-100">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-pink-50/70 via-white/60 to-sky-50/70">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200/80 bg-white/80 px-3 py-2">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tell Cutie what's on your mind..."
              disabled={isInputDisabled}
              className="flex-1 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isSendDisabled}
              className="inline-flex items-center justify-center px-3 py-2 rounded-full bg-pink-500 text-white text-xs md:text-sm font-semibold shadow-[0_8px_22px_rgba(236,72,153,0.55)] hover:bg-pink-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </form>
          {renderStatus() && <p className="mt-2 text-xs text-slate-500">{renderStatus()}</p>}
        </div>
      </div>
    </div>
  )
}
