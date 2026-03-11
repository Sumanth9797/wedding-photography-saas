import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from './NotificationBell'
import { FiCamera } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const homeRoute = user?.role === 'PHOTOGRAPHER' ? '/photographer'
    : user?.role === 'EDITOR' ? '/editor' : '/login'

  return (
    <nav className="bg-primary text-white shadow-lg fixed top-0 left-0 right-0 z-40 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to={homeRoute} className="flex items-center gap-2 font-bold text-xl">
          <FiCamera className="w-6 h-6 text-accent" />
          <span>WeddingSnap</span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <NotificationBell />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-white">
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="text-sm hidden sm:block">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
