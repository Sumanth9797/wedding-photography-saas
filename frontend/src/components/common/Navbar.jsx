import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiMenu, FiLogOut, FiUser, FiSettings, FiCamera } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'
import { useDarkMode, THEME_ORDER } from '../../hooks/useDarkMode'
import { clsx } from 'clsx'

export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [theme, setTheme] = useDarkMode()

  const cycleTheme = () => {
    setTheme(THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length])
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-16 bg-white/90 dark:bg-dark-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 flex items-center px-4 gap-4 transition-colors duration-300">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/6 rounded-xl text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Logo (mobile) */}
      <Link to="/" className="flex items-center gap-2 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/10 flex items-center justify-center">
          <FiCamera className="w-4 h-4 text-gray-700 dark:text-white" />
        </div>
        <span className="font-display font-bold text-gray-900 dark:text-white">WeddingSnap</span>
      </Link>

      {/* Page title */}
      {title && (
        <h1 className="hidden lg:block text-base font-medium text-gray-700 dark:text-white/80 tracking-wide">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-3">
        {/* Theme toggle */}
        <ThemeToggle theme={theme} onCycle={cycleTheme} />

        <NotificationBell />

        {/* User avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/6 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/15 flex items-center justify-center text-gray-700 dark:text-white text-sm font-semibold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-600 dark:text-white/70 max-w-[120px] truncate">
              {user?.name || 'User'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-600 rounded-xl shadow-lg dark:shadow-dark-card-hover border border-gray-200 dark:border-white/8 py-1 animate-scale-in">
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-white/6">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{user?.role}</p>
              </div>
              <button
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-150"
              >
                <FiUser className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-150"
              >
                <FiSettings className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-gray-100 dark:border-white/6 mt-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500/80 dark:text-red-400/80 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/8 transition-all duration-150"
              >
                <FiLogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

