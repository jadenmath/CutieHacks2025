import { callGeminiChat, type GeminiMessage } from './geminiClient'

type IncomingMessage = {
  sender: 'user' | 'cutie'
  text: string
  timestamp?: string
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { mood, messages } = req.body as {
      mood?: string
      messages?: IncomingMessage[]
    }

    if (!mood || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid body' })
    }

    const sanitizedMood = String(mood).trim()
    const sanitizedMessages = messages.filter((msg) => typeof msg?.text === 'string' && msg.text.trim().length)

    if (!sanitizedMood || !sanitizedMessages.length) {
      return res.status(400).json({ error: 'Invalid body' })
    }

    const systemPrompt = `You are "Cutie", a warm, gentle wellness companion talking to a university student.
Your style:
- Short, friendly messages (1–3 sentences)
- Validating and non-judgmental
- No clinical or diagnostic language
- No medical or crisis advice
The student's self-reported mood at the start is: ${sanitizedMood}.
Ask gentle follow-up questions and help them reflect.`

    const geminiMessages: GeminiMessage[] = [
      { role: 'system', content: systemPrompt },
      ...sanitizedMessages.map((message) => ({
        role: (message.sender === 'user' ? 'user' : 'assistant') as GeminiMessage['role'],
        content: message.text.trim(),
      })),
    ]

    const reply = await callGeminiChat(geminiMessages)
    return res.status(200).json({ reply })
  } catch (error) {
    console.error('Gemini chat error', error)
    return res.status(500).json({ error: 'Failed to get Gemini chat reply' })
  }
}
