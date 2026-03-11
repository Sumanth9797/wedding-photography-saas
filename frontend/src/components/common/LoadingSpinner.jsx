import { clsx } from 'clsx'

export default function LoadingSpinner({ size = 'md', fullScreen = false, className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div className={clsx(
      'rounded-full border-gray-200 animate-spin',
      'border-t-primary-600 border-r-secondary-500',
      sizes[size] || sizes.md,
      className
    )} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-primary-600 border-r-secondary-500 animate-spin" />
          <p className="text-text-muted text-sm font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return spinner
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={clsx('bg-white rounded-2xl shadow-card overflow-hidden', className)}>
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-2/3 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx('skeleton h-4 rounded-lg', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' }
  return <div className={clsx('skeleton rounded-full flex-shrink-0', sizes[size], className)} />
}
