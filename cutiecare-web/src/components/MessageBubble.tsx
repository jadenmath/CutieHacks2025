import type { ChatMessage } from '../types'

type MessageBubbleProps = {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.sender === 'cutie') {
    return (
      <div className="flex items-start gap-2 max-w-[80%]">
        <div className="mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-xs text-white shadow-md">
          💖
        </div>
        <div className="rounded-2xl bg-white/90 border border-pink-100 px-3 py-2 text-xs md:text-sm text-slate-700 shadow-sm">
          {message.text}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl bg-pink-500 text-white px-3 py-2 text-xs md:text-sm shadow-md">
        {message.text}
      </div>
    </div>
  )
}
