import { ReactNode } from 'react'

type CardProps = {
  title?: string
  description?: string
  children?: ReactNode
  className?: string
}

export function Card({ title, description, children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_18px_60px_rgba(15,23,42,0.12)] p-5 md:p-6 ${className}`.trim()}
    >
      {(title || description) && (
        <div className="mb-4 space-y-1">
          {title && <h3 className="text-xl font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-600">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
