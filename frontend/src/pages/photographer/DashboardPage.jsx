import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { analyticsService } from '../../services/analyticsService'
import { eventService } from '../../services/eventService'
import { formatDate } from '../../utils/helpers'
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants'
import { FiCamera, FiCalendar, FiImage, FiStar, FiPlus } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          analyticsService.getOverview(),
          eventService.list(),
        ])
        setStats(statsRes.data)
        setEvents(eventsRes.data.slice(0, 5))
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = stats ? [
    { icon: FiCalendar, label: 'Total Events', value: stats.totalEvents, color: 'text-blue-500 bg-blue-50' },
    { icon: FiImage, label: 'Total Photos', value: stats.totalPhotos, color: 'text-green-500 bg-green-50' },
    { icon: FiCamera, label: 'Selections', value: stats.totalSelections, color: 'text-purple-500 bg-purple-50' },
    { icon: FiStar, label: 'Avg Rating', value: `${stats.averageRating || 0} ★`, color: 'text-yellow-500 bg-yellow-50' },
  ] : []

  const chartData = stats?.eventsByStatus
    ? Object.entries(stats.eventsByStatus).map(([status, count]) => ({
        name: STATUS_LABELS[status] || status, count
      }))
    : []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar role="PHOTOGRAPHER" />
      <main className="pt-16 md:pl-56">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your overview.</p>
            </div>
            <Link to="/photographer/events/new">
              <button className="btn-primary flex items-center gap-2">
                <FiPlus /> New Event
              </button>
            </Link>
          </div>

          {loading ? <LoadingSpinner /> : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="card">
                    <div className={`inline-flex p-3 rounded-xl ${color} mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Events by Status Chart */}
                {chartData.length > 0 && (
                  <div className="card">
                    <h2 className="font-semibold text-gray-800 mb-4">Events by Status</h2>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Recent Events */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800">Recent Events</h2>
                    <Link to="/photographer/events" className="text-primary text-sm hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {events.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-4">No events yet</p>
                    ) : events.map(event => (
                      <Link
                        key={event.id}
                        to={`/photographer/events/${event.id}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{event.title}</p>
                          <p className="text-xs text-gray-400">{formatDate(event.weddingDate)}</p>
                        </div>
                        <span className={STATUS_COLORS[event.status] || 'badge-draft'}>
                          {STATUS_LABELS[event.status] || event.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
