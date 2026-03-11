import clsx from 'clsx'
import LoadingSpinner from './LoadingSpinner'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-400',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-400',
    accent: 'bg-accent text-white hover:bg-accent-600 focus:ring-accent-400',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary-400',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}
