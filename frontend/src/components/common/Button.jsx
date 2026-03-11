import { clsx } from 'clsx'
import { FiLoader } from 'react-icons/fi'

const variants = {
  // White button — black text (primary CTA on dark bg)
  primary: 'bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-glow focus:ring-2 focus:ring-white/40',
  // White border outline
  secondary: 'border border-white/25 text-white hover:bg-white/8 hover:border-white/50 active:scale-[0.98] backdrop-blur-sm focus:ring-2 focus:ring-white/20',
  // Subtle ghost
  ghost: 'text-white/65 hover:bg-white/6 hover:text-white active:scale-[0.98] focus:ring-2 focus:ring-white/15',
  // Danger
  danger: 'bg-red-600 text-white hover:bg-red-500 active:scale-[0.98] shadow-md focus:ring-2 focus:ring-red-400/50',
  // Silver accent
  accent: 'bg-gradient-to-r from-white/90 to-white/70 text-black hover:from-white hover:to-white/85 active:scale-[0.98] shadow-md focus:ring-2 focus:ring-white/30',
  // Dark card style (for light mode or inverted areas)
  outline: 'border border-white/15 text-white/75 hover:border-white/35 hover:text-white hover:bg-white/5 active:scale-[0.98] focus:ring-2 focus:ring-white/15',
}

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-lg',
  sm: 'px-3.5 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3 text-base rounded-xl',
  xl: 'px-10 py-4 text-lg rounded-2xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <FiLoader className="animate-spin w-4 h-4 flex-shrink-0" />}
      {children}
    </button>
  )
}

