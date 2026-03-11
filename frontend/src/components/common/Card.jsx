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
          ? 'glass border border-white/8'
          : 'bg-dark-600 border border-white/5 shadow-dark-card',
        hoverable && [
          'hover:shadow-dark-card-hover hover:-translate-y-1',
          'hover:border-white/10 transition-all duration-300 cursor-pointer',
        ],
        !hoverable && 'transition-colors duration-200',
        padding,
        className
      )}
    >
      {children}
    </div>
  )
}

