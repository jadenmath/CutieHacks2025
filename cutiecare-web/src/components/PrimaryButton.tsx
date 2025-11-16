import { ButtonHTMLAttributes, ReactNode } from 'react'

type PrimaryButtonProps = {
  children: ReactNode
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function PrimaryButton({
  children,
  className = '',
  type = 'button',
  disabled,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-pink-500 shadow-[0_12px_30px_rgba(236,72,153,0.45)] transition-all duration-200 hover:bg-pink-600 hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_6px_14px_rgba(190,24,93,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-pink-500 disabled:shadow-none ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  )
}
