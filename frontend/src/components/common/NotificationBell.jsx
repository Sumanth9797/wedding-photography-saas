import { useState, useRef } from 'react'
import { FiBell } from 'react-icons/fi'
import { useNotifications } from '../../context/NotificationContext'
import { timeAgo } from '../../utils/helpers'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markAsRead } = useNotifications()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-white/80 hover:text-white rounded-lg transition-colors"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl z-50 border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-6 text-center text-gray-500 text-sm">No notifications</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !n.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-700">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
