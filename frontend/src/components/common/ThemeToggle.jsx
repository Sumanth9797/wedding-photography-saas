import { FiSun, FiMoon } from 'react-icons/fi'
import { clsx } from 'clsx'

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={clsx(
        'relative inline-flex items-center w-12 h-6 rounded-full transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900',
        isDark
          ? 'bg-white/10 border border-white/15'
          : 'bg-gray-200 border border-gray-300'
      )}
    >
      {/* Thumb */}
      <span
        className={clsx(
          'absolute w-4 h-4 rounded-full shadow transition-all duration-300 flex items-center justify-center',
          isDark
            ? 'translate-x-[26px] bg-white'
            : 'translate-x-[3px] bg-gray-800'
        )}
      >
        {isDark
          ? <FiMoon className="w-2.5 h-2.5 text-gray-800" />
          : <FiSun className="w-2.5 h-2.5 text-white" />
        }
      </span>
    </button>
  )
}

