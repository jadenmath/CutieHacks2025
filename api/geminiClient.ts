const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_MODEL = 'gemini-2.5-flash'

if (!GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set')
}

export type GeminiMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function callGeminiChat(messages: GeminiMessage[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing')
  }

  const url = `${GEMINI_BASE_URL}/${DEFAULT_MODEL}:generateContent?key=${GEMINI_API_KEY}`

  const contents = messages.map((message) => ({
    role: message.role === 'system' ? 'user' : message.role,
    parts: [{ text: message.content }],
  }))

  const body = { contents }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Gemini error: ${response.status} ${text}`)
  }

  const json = (await response.json()) as any
  const candidate = json.candidates && json.candidates[0] && json.candidates[0].content
  const part = candidate?.parts?.[0]?.text ?? ''
  return String(part).trim()
}
