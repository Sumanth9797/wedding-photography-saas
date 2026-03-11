import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiMenu, FiLogOut, FiUser, FiSettings, FiCamera } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'
import { useDarkMode } from '../../hooks/useDarkMode'
import { clsx } from 'clsx'

export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [isDark, setIsDark] = useDarkMode()

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
    <header className="fixed top-0 left-0 right-0 z-20 h-16 bg-white/80 dark:bg-dark-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-dark-600 flex items-center px-4 gap-4 transition-colors duration-300">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Logo (mobile) */}
      <Link to="/" className="flex items-center gap-2 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
          <FiCamera className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-gray-900 dark:text-white">WeddingSnap</span>
      </Link>

      {/* Page title */}
      {title && (
        <h1 className="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-3">
        {/* Theme toggle */}
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

        <NotificationBell />

        {/* User avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
              {user?.name || 'User'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-700 rounded-xl shadow-card-hover dark:shadow-dark-card-hover border border-gray-100 dark:border-dark-500 py-1 animate-scale-in">
              <div className="px-4 py-2 border-b border-gray-50 dark:border-dark-600">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
              <button
                onClick={() => { setDropdownOpen(false) }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
              >
                <FiUser className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={() => { setDropdownOpen(false) }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
              >
                <FiSettings className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-gray-50 dark:border-dark-600 mt-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
