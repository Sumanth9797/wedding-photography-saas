import { useState, useRef, useEffect } from 'react'
import { FiBell, FiX } from 'react-icons/fi'
import { clsx } from 'clsx'
import { useNotifications } from '../../context/NotificationContext'
import { timeAgo } from '../../utils/helpers'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { notifications = [], unreadCount = 0, markAsRead, markAllAsRead } = useNotifications() || {}

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 hover:text-gray-900"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center animate-bounce-subtle">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden animate-scale-in z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {(!notifications || notifications.length === 0) ? (
              <div className="py-8 text-center">
                <FiBell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notifications</p>
              </div>
            ) : notifications.slice(0, 10).map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead && markAsRead(n.id)}
                className={clsx(
                  'px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors',
                  !n.read && 'bg-primary-50/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                    n.read ? 'bg-gray-200' : 'bg-primary-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{n.title || n.message}</p>
                    {n.body && <p className="text-xs text-gray-500 mt-0.5 truncate">{n.body}</p>}
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt || n.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
