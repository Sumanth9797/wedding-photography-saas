import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi'
import { clsx } from 'clsx'

const THEME_META = {
  system: {
    label: 'System theme',
    Icon: FiMonitor,
    title: 'System theme (follows OS preference)',
  },
  light: {
    label: 'Light mode',
    Icon: FiSun,
    title: 'Light mode',
  },
  dark: {
    label: 'Dark mode',
    Icon: FiMoon,
    title: 'Dark mode',
  },
}

// theme: 'system' | 'light' | 'dark'
// onCycle: () => void  – cycles system → light → dark → system
export default function ThemeToggle({ theme = 'system', onCycle }) {
  const current = THEME_META[theme] ?? THEME_META.system
  const { Icon, title } = current

  return (
    <button
      onClick={onCycle}
      aria-label={title}
      title={title}
      className={clsx(
        'relative inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2',
        theme === 'dark'
          ? 'bg-white/10 border border-white/15 text-white hover:bg-white/15'
          : theme === 'light'
          ? 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
          : 'bg-white/8 border border-white/10 dark:text-white/80 text-gray-600 hover:bg-gray-100 dark:hover:bg-white/15'
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

