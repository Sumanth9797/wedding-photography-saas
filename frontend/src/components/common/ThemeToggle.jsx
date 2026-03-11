import { FiSun, FiMoon } from 'react-icons/fi'
import { clsx } from 'clsx'

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={clsx(
        'relative inline-flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
        isDark
          ? 'bg-dark-600 focus:ring-offset-dark-800'
          : 'bg-gray-200 focus:ring-offset-white'
      )}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 text-amber-400 transition-opacity duration-300"
        style={{ opacity: isDark ? 0 : 1 }}>
        <FiSun className="w-3.5 h-3.5" />
      </span>
      <span className="absolute right-1.5 text-blue-300 transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0 }}>
        <FiMoon className="w-3.5 h-3.5" />
      </span>

      {/* Thumb */}
      <span
        className={clsx(
          'absolute w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center',
          isDark
            ? 'translate-x-7 bg-dark-800'
            : 'translate-x-1 bg-white'
        )}
      >
        {isDark
          ? <FiMoon className="w-3 h-3 text-primary-400" />
          : <FiSun className="w-3 h-3 text-amber-500" />
        }
      </span>
    </button>
  )
}
