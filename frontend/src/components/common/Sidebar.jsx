import { Link, useLocation } from 'react-router-dom'
import { FiGrid, FiCalendar, FiBarChart2, FiCamera } from 'react-icons/fi'

const photographerNav = [
  { path: '/photographer', icon: FiGrid, label: 'Dashboard' },
  { path: '/photographer/events', icon: FiCalendar, label: 'Events' },
  { path: '/photographer/analytics', icon: FiBarChart2, label: 'Analytics' },
]

const editorNav = [
  { path: '/editor', icon: FiCamera, label: 'Assignments' },
]

export default function Sidebar({ role }) {
  const location = useLocation()
  const navItems = role === 'PHOTOGRAPHER' ? photographerNav : editorNav

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-white border-r border-gray-100 shadow-sm z-30 hidden md:block">
      <nav className="p-4 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
