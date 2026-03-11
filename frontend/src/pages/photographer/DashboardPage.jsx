import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiCalendar, FiImage, FiCheckSquare, FiStar,
  FiPlus, FiArrowRight, FiTrendingUp, FiEye,
} from 'react-icons/fi'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import EventCard from '../../components/photographer/EventCard'
import { eventService } from '../../services/eventService'
import { analyticsService } from '../../services/analyticsService'
import { formatDate } from '../../utils/helpers'
import { STATUS_LABELS } from '../../utils/constants'
import { useAuth } from '../../context/AuthContext'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

const STATUS_BADGE = {
  DRAFT: 'badge-draft',
  ACTIVE: 'badge-active',
  EDITING: 'badge-editing',
  REVIEW: 'badge-review',
  COMPLETED: 'badge-completed',
}

const STATUS_PROGRESS = {
  DRAFT: 10, ACTIVE: 40, EDITING: 65, REVIEW: 85, COMPLETED: 100,
}

function StatCard({ icon: Icon, label, value, change, color, loading }) {
  if (loading) return <SkeletonCard className="h-28" />
  return (
    <div className="bg-dark-600 border border-white/5 rounded-2xl shadow-dark-card p-5 hover:shadow-dark-card-hover hover:border-white/10 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/40 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <p className={clsx('text-xs mt-1 flex items-center gap-1', change >= 0 ? 'text-white/50' : 'text-red-400/70')}>
              <FiTrendingUp className="w-3 h-3" />
              {change >= 0 ? '+' : ''}{change}% this month
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white/60" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      eventService.list().catch(() => ({ data: [] })),
      analyticsService.getSummary().catch(() => ({ data: null })),
    ]).then(([eventsRes, statsRes]) => {
      setEvents(eventsRes.data || [])
      setStats(statsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const recentEvents = events.slice(0, 5)
  const activeCount = events.filter(e => e.status === 'ACTIVE').length
  const totalPhotos = events.reduce((sum, e) => sum + (e.photoCount || 0), 0)

  const STAT_CARDS = [
    { icon: FiCalendar, label: 'Total Events', value: loading ? '—' : events.length, change: 12, color: '' },
    { icon: FiImage, label: 'Total Photos', value: loading ? '—' : totalPhotos.toLocaleString(), change: 8, color: '' },
    { icon: FiCheckSquare, label: 'Active Events', value: loading ? '—' : activeCount, change: -3, color: '' },
    { icon: FiStar, label: 'Avg Rating', value: stats?.avgRating ? stats.avgRating.toFixed(1) : '—', color: '' },
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar role="PHOTOGRAPHER" />
      <Navbar title="Dashboard" />

      <main className="pt-16 lg:pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Welcome banner */}
          <div className="bg-dark-600 border border-white/6 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/3 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 right-20 w-24 h-24 bg-white/2 rounded-full translate-y-6" />
            <div className="relative">
              <h1 className="text-2xl font-display font-bold mb-1">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'Photographer'}! 👋
              </h1>
              <p className="text-white/50 mb-4">You have {activeCount} active events. Keep up the great work!</p>
              <Link
                to="/photographer/events/new"
                className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all hover:scale-[1.02]"
              >
                <FiPlus className="w-4 h-4" /> New Event
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map((card, i) => (
              <StatCard key={i} {...card} loading={loading} />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Events (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Recent Events</h2>
                <Link to="/photographer/events" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  View all <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <SkeletonCard key={i} className="h-24" />)}
                </div>
              ) : recentEvents.length === 0 ? (
                <div className="bg-dark-600 rounded-2xl shadow-dark-card p-12 text-center border border-white/6">
                  <FiCalendar className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <h3 className="font-semibold text-white/40 mb-1">No events yet</h3>
                  <p className="text-sm text-white/30 mb-4">Create your first event to get started</p>
                  <Link to="/photographer/events/new">
                    <button className="btn-primary text-sm px-4 py-2">Create Event</button>
                  </Link>
                </div>
              ) : (
                <div className="bg-dark-600 rounded-2xl shadow-dark-card overflow-hidden border border-white/6">
                  <table className="w-full">
                    <thead className="bg-dark-700 border-b border-white/5">
                      <tr>
                        <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-3">Event</th>
                        <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Date</th>
                        <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-3">Status</th>
                        <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Progress</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-dark-600">
                      {recentEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-white/4 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-white text-sm">{event.title}</p>
                            <p className="text-xs text-white/30">{event.photoCount || 0} photos</p>
                          </td>
                          <td className="px-5 py-4 text-sm text-white/40 hidden md:table-cell">
                            {event.eventDate ? formatDate(event.eventDate) : 'TBD'}
                          </td>
                          <td className="px-5 py-4">
                            <span className={clsx('badge text-xs', STATUS_BADGE[event.status] || 'badge-draft')}>
                              {STATUS_LABELS[event.status] || event.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <div className="w-24">
                              <div className="w-full h-1.5 bg-white/5 rounded-full">
                                <div
                                  className="h-full rounded-full bg-white/50"
                                  style={{ width: `${STATUS_PROGRESS[event.status] || 10}%` }}
                                />
                              </div>
                              <p className="text-xs text-white/30 mt-1">{STATUS_PROGRESS[event.status] || 10}%</p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Link
                              to={`/photographer/events/${event.id}`}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions (1/3 width) */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { icon: FiPlus, label: 'Create New Event', desc: 'Start a new wedding event', to: '/photographer/events/new', color: 'bg-white/6 text-white/60' },
                  { icon: FiCalendar, label: 'View All Events', desc: 'Manage your events', to: '/photographer/events', color: 'bg-white/5 text-white/50' },
                  { icon: FiTrendingUp, label: 'Analytics', desc: 'View performance stats', to: '/photographer/analytics', color: 'bg-white/5 text-white/50' },
                ].map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex items-center gap-4 p-4 bg-dark-600 rounded-xl shadow-soft dark:shadow-dark-card hover:shadow-card dark:hover:shadow-dark-card-hover transition-all hover:-translate-y-0.5 border border-white/6"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{action.label}</p>
                      <p className="text-xs text-white/30">{action.desc}</p>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 ml-auto" />
                  </Link>
                ))}
              </div>

              {/* Recent activity placeholder */}
              <div className="mt-6 bg-dark-600 rounded-2xl shadow-dark-card p-5 border border-white/6">
                <h3 className="font-semibold text-white mb-3 text-sm">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { text: 'Gallery link sent', time: '2m ago', dot: 'bg-white/60' },
                    { text: 'Photos uploaded', time: '1h ago', dot: 'bg-white/40' },
                    { text: 'Client selected photos', time: '3h ago', dot: 'bg-amber-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                      <span className="text-sm text-white/55 flex-1">{item.text}</span>
                      <span className="text-xs text-white/30">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
