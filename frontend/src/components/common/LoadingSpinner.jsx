import { clsx } from 'clsx'

/**
 * Premium monochrome loading spinner
 */
export default function LoadingSpinner({ size = 'md', fullScreen = false, text = '', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }

  const strokeSizes = {
    sm: 'border',
    md: 'border-2',
    lg: 'border-2',
    xl: 'border-[3px]',
  }

  const spinner = (
    <div
      className={clsx(
        'rounded-full',
        'border-white/10',
        'border-t-white/90 border-r-white/30',
        'animate-spin',
        sizes[size] || sizes.md,
        strokeSizes[size] || strokeSizes.md,
        className
      )}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50">
        <div className="flex flex-col items-center gap-5">
          {/* Dual-ring premium loader */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-white/8 border-t-white/70 animate-spin" />
            <div
              className="absolute inset-2 rounded-full border border-white/5 border-b-white/40 animate-spin"
              style={{ animationDuration: '1.4s', animationDirection: 'reverse' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft" />
            </div>
          </div>
          <p className="text-white/50 text-sm font-medium tracking-widest uppercase">
            {text || 'Loading'}
          </p>
        </div>
      </div>
    )
  }

  return spinner
}

/**
 * Inline dual-ring spinner
 */
export function SpinnerInline({ size = 'sm', className = '' }) {
  const sizes = { xs: 'w-3 h-3 border', sm: 'w-4 h-4 border', md: 'w-5 h-5 border-2' }
  return (
    <div
      className={clsx(
        'rounded-full border-white/15 border-t-white/80 animate-spin',
        sizes[size] || sizes.sm,
        className
      )}
    />
  )
}

/**
 * Skeleton card (dark monochrome)
 */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={clsx('bg-dark-600 rounded-2xl border border-white/5 overflow-hidden', className)}>
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
    <div className={clsx('space-y-2.5', className)}>
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
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14', xl: 'w-20 h-20' }
  return <div className={clsx('skeleton rounded-full flex-shrink-0', sizes[size], className)} />
}

export function SkeletonLine({ width = 'w-full', height = 'h-4', className = '' }) {
  return <div className={clsx('skeleton rounded-lg', width, height, className)} />
}

