import { clsx } from 'clsx'
import { FiLoader } from 'react-icons/fi'

const variants = {
  primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-glow focus:ring-primary-400',
  secondary: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white active:scale-[0.98] focus:ring-primary-400 bg-transparent',
  ghost: 'text-gray-600 hover:bg-gray-100 active:scale-[0.98] focus:ring-gray-300 bg-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] focus:ring-red-400 shadow-md',
  accent: 'bg-gradient-to-r from-accent-600 to-accent-400 text-white hover:from-accent-700 hover:to-accent-500 active:scale-[0.98] focus:ring-accent-400 shadow-md',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-[0.98] focus:ring-gray-300 bg-transparent',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
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
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <FiLoader className="animate-spin w-4 h-4" />}
      {children}
    </button>
  )
}
