import { callGeminiChat } from './geminiClient'

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

    const conversationText = sanitizedMessages
      .map((message) => `${message.sender === 'user' ? 'User' : 'Cutie'}: ${message.text.trim()}`)
      .join('\n')

    const prompt = `You are summarizing a supportive conversation between a student and "Cutie", a warm wellness companion.
The student's self-reported mood at the start was: ${sanitizedMood}.

Write a single-paragraph, neutral, non-judgmental summary of what the student shared and how they seemed to feel.
Rules:
- Do NOT give any advice, instructions, or coping strategies.
- Do NOT use diagnostic or clinical language.
- Do NOT reference yourself, Cutie, or an AI.
- Just describe the student's experience and themes they mentioned in simple, compassionate language.

Conversation:
${conversationText}`

    const summary = await callGeminiChat([{ role: 'user', content: prompt }])
    return res.status(200).json({ summary })
  } catch (error) {
    console.error('Gemini summarize error', error)
    return res.status(500).json({ error: 'Failed to summarize conversation' })
  }
}
