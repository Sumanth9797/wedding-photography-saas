import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiHome, FiCalendar, FiBarChart2, FiEdit3, FiImage,
  FiLogOut, FiChevronLeft, FiChevronRight, FiCamera,
} from 'react-icons/fi'
import { clsx } from 'clsx'
import { useAuth } from '../../context/AuthContext'

const NAV_CONFIG = {
  PHOTOGRAPHER: [
    { label: 'Dashboard', path: '/photographer', icon: FiHome, exact: true },
    { label: 'Events', path: '/photographer/events', icon: FiCalendar },
    { label: 'Analytics', path: '/photographer/analytics', icon: FiBarChart2 },
  ],
  EDITOR: [
    { label: 'Dashboard', path: '/editor', icon: FiHome, exact: true },
    { label: 'Assignments', path: '/editor', icon: FiEdit3 },
  ],
  CLIENT: [
    { label: 'Gallery', path: '#', icon: FiImage },
  ],
}

export default function Sidebar({ role }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = NAV_CONFIG[role] || NAV_CONFIG.PHOTOGRAPHER

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      <div className={clsx(
        'fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity',
        collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )} onClick={() => setCollapsed(true)} />

      {/* Sidebar */}
      <aside className={clsx(
        'fixed top-0 left-0 h-full z-30 bg-white border-r border-gray-100 shadow-soft',
        'flex flex-col transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
        // Mobile: hide when collapsed
        'lg:translate-x-0',
        collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      )}>
        {/* Logo */}
        <div className={clsx(
          'flex items-center h-16 border-b border-gray-100 px-4',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center flex-shrink-0">
            <FiCamera className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-gray-900 text-lg truncate">WeddingSnap</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={clsx('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-gray-100 p-3 space-y-2">
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={clsx(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all',
              collapsed && 'justify-center'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <FiLogOut className={clsx('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-primary-600 hidden lg:flex"
        >
          {collapsed ? <FiChevronRight className="w-3 h-3" /> : <FiChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  )
}
