export type Mood =
  | 'Happy'
  | 'Tired'
  | 'Stressed'
  | 'Anxious'
  | 'Excited'
  | 'Meh'

export interface MoodEntry {
  id: string
  created_at: string
  user_id: string
  mood: Mood | string
  note?: string | null
}

export type ChatSender = 'user' | 'cutie'

export interface ChatMessage {
  id: string
  sender: ChatSender
  text: string
  timestamp: string
}
