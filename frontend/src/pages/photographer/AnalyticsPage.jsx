import { useState, useEffect } from 'react'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { analyticsService } from '../../services/analyticsService'
import { FiTrendingUp, FiImage, FiStar, FiCalendar } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import toast from 'react-hot-toast'

const COLORS = ['#1E3A5F', '#6B4FA0', '#D4A843', '#10B981', '#EF4444']

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsService.getOverview()
      .then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const statusData = stats?.eventsByStatus
    ? Object.entries(stats.eventsByStatus).map(([name, value]) => ({ name, value }))
    : []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar role="PHOTOGRAPHER" />
      <main className="pt-16 md:pl-56">
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-6">Analytics</h1>

          {loading ? <LoadingSpinner /> : (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: FiCalendar, label: 'Total Events', value: stats?.totalEvents, color: 'text-blue-500 bg-blue-50' },
                  { icon: FiImage, label: 'Total Photos', value: stats?.totalPhotos, color: 'text-green-500 bg-green-50' },
                  { icon: FiTrendingUp, label: 'Client Selections', value: stats?.totalSelections, color: 'text-purple-500 bg-purple-50' },
                  { icon: FiStar, label: 'Avg Client Rating', value: `${stats?.averageRating || 0} ★`, color: 'text-yellow-500 bg-yellow-50' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="card">
                    <div className={`inline-flex p-3 rounded-xl ${color} mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{value ?? 0}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                {statusData.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold text-gray-800 mb-4">Events by Status</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                          {statusData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {statusData.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold text-gray-800 mb-4">Event Distribution</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={statusData}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#6B4FA0" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
