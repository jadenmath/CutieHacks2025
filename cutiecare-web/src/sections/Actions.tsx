import { useState } from 'react'
import { Card } from '../components/Card'
import { PrimaryButton } from '../components/PrimaryButton'

const toolkitItems = [
  {
    key: 'breathing',
    icon: '🌬️',
    title: 'Breathing exercise',
    description: 'Slow, intentional breaths to calm your nervous system in under two minutes.',
    placeholder: 'Breathing exercise coming soon…',
  },
  {
    key: 'grounding',
    icon: '🧘',
    title: 'Grounding exercise',
    description: 'Use the 5-4-3-2-1 method to reconnect with the present moment.',
    placeholder: 'Grounding exercise coming soon…',
  },
  {
    key: 'timer',
    icon: '⏱️',
    title: 'Study timer',
    description: 'Create a cozy 25-minute focus sprint with gentle reminders to rest.',
    placeholder: 'Study timer coming soon…',
  },
]

export function ActionsSection() {
  const [toolStatus, setToolStatus] = useState<Record<string, string>>({})

  const handleOpen = (key: string, message: string) => {
    setToolStatus((prev) => ({ ...prev, [key]: message }))
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <Card className="hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-slate-900">Wellness toolkit</h3>
          <p className="text-sm text-slate-600">
            A tiny shelf of rituals to help you reset between classes, practice compassion, and keep Cutie close.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {toolkitItems.map((item) => (
          <Card
            key={item.key}
            className="h-full hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200"
          >
            <div className="flex flex-col h-full space-y-4">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-100 text-2xl flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h4 className="text-xl font-semibold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
              <div className="mt-auto space-y-2">
                <PrimaryButton onClick={() => handleOpen(item.key, item.placeholder)}>Try this</PrimaryButton>
                {toolStatus[item.key] && <p className="text-xs text-slate-500">{toolStatus[item.key]}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
