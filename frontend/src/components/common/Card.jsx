import { clsx } from 'clsx'

export default function Card({
  children,
  className = '',
  hoverable = false,
  glass = false,
  padding = 'p-6',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl',
        glass
          ? 'glass border border-white/30'
          : 'bg-white shadow-card',
        hoverable && 'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer',
        padding,
        className
      )}
    >
      {children}
    </div>
  )
}
