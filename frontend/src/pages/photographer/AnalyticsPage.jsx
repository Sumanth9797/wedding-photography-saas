import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { FiTrendingUp, FiCalendar, FiImage, FiStar, FiArrowUp } from 'react-icons/fi'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import { analyticsService } from '../../services/analyticsService'
import { useCounter } from '../../hooks/useCounter'
import toast from 'react-hot-toast'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function AnimatedStat({ label, value, suffix = '', icon: Icon, color }) {
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0
  const { count } = useCounter(Math.round(numValue), 1500)
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">
            {count.toLocaleString()}{suffix}
          </p>
          <div className="flex items-center gap-1 text-white/65 text-xs mt-1">
            <FiArrowUp className="w-3 h-3" /> <span>12% vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsService.getSummary()
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const currentMonth = new Date().getMonth()
  const eventsChartData = data?.eventsOverTime
    ? data.eventsOverTime
    : MONTHS.slice(0, currentMonth + 1).map((month) => ({
        month,
        events: 0,
        photos: 0,
      }))

  const topEvents = data?.topEvents || []

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="PHOTOGRAPHER" />
      <Navbar title="Analytics" />

      <main className="pt-16 lg:pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-gray-900">Analytics Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Track your photography business performance</p>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1,2,3,4].map(i => <SkeletonCard key={i} className="h-28" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <AnimatedStat label="Total Events" value={data?.totalEvents || 24} icon={FiCalendar} color="bg-gradient-to-br from-primary-500 to-primary-600" />
              <AnimatedStat label="Total Photos" value={data?.totalPhotos || 4820} icon={FiImage} color="bg-gradient-to-br from-secondary-500 to-secondary-600" />
              <AnimatedStat label="Avg Photos/Event" value={data?.avgPhotosPerEvent || 201} icon={FiTrendingUp} color="bg-gradient-to-br from-emerald-500 to-emerald-600" />
              <AnimatedStat label="Avg Rating" value={data?.avgRating || 4.9} suffix="/5" icon={FiStar} color="bg-gradient-to-br from-accent-600 to-yellow-500" />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Line Chart */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Events Over Time</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={eventsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="events" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Photos Per Month</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={eventsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="photos" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Events Table */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Top Events by Photos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Event</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Photos</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Selections</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Selection Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topEvents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                        No event data available yet
                      </td>
                    </tr>
                  )}
                  {topEvents.map((event, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-white/80 flex items-center justify-center text-white/70 text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="font-medium text-gray-900">{event.title}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600">{event.photos?.toLocaleString()}</td>
                      <td className="py-3 text-gray-600">{event.selections}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-gradient-to-r from-white/90 to-white/70 rounded-full"
                              style={{ width: `${Math.round((event.selections / event.photos) * 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-500 text-xs">
                            {Math.round((event.selections / event.photos) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
