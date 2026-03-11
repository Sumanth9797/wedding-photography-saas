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
      <div
        className={clsx(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300',
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        onClick={() => setCollapsed(true)}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full z-30',
          'bg-dark-800 border-r border-white/5',
          'flex flex-col transition-all duration-300 ease-spring',
          collapsed ? 'w-16' : 'w-64',
          'lg:translate-x-0',
          collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        )}
      >
        {/* Logo */}
        <div
          className={clsx(
            'flex items-center h-16 border-b border-white/5 px-4',
            collapsed ? 'justify-center' : 'gap-3'
          )}
        >
          <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
            <FiCamera className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-white text-lg truncate">WeddingSnap</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white text-black shadow-md'
                      : 'text-white/50 hover:bg-white/6 hover:text-white',
                    collapsed && 'justify-center'
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className={clsx('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/5 p-3 space-y-1">
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
                <p className="text-xs text-white/35 truncate">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={clsx(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium',
              'text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200',
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
          className="absolute -right-3.5 top-20 w-7 h-7 bg-dark-600 border border-white/8 rounded-full flex items-center justify-center shadow-dark-card hover:bg-dark-500 transition-colors text-white/40 hover:text-white hidden lg:flex"
        >
          {collapsed
            ? <FiChevronRight className="w-3 h-3" />
            : <FiChevronLeft className="w-3 h-3" />
          }
        </button>
      </aside>
    </>
  )
}

