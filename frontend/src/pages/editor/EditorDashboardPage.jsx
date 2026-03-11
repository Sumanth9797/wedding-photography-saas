import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit3, FiCalendar, FiImage, FiClock, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import { editorService } from '../../services/editorService'
import { formatDate, truncate } from '../../utils/helpers'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

const STATUS_INFO = {
  ACTIVE: { label: 'In Progress', cls: 'badge-active', progress: 40 },
  EDITING: { label: 'Editing', cls: 'badge-editing', progress: 65 },
  REVIEW: { label: 'Under Review', cls: 'badge-review', progress: 85 },
  COMPLETED: { label: 'Completed', cls: 'badge-completed', progress: 100 },
  DRAFT: { label: 'Pending', cls: 'badge-draft', progress: 10 },
}

function AssignmentCard({ assignment }) {
  const status = assignment.status || 'ACTIVE'
  const info = STATUS_INFO[status] || STATUS_INFO.ACTIVE
  const deadline = assignment.deadline || assignment.eventDate
  const isOverdue = deadline && new Date(deadline) < new Date() && status !== 'COMPLETED'

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className={`h-1.5 w-full bg-gradient-to-r ${
        status === 'COMPLETED' ? 'from-purple-400 to-purple-600' :
        status === 'EDITING' ? 'from-amber-400 to-amber-600' :
        status === 'REVIEW' ? 'from-blue-400 to-blue-600' :
        'from-emerald-400 to-emerald-600'
      }`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg mb-0.5 truncate">{assignment.eventTitle || assignment.title}</h3>
            <p className="text-sm text-gray-500">
              by {assignment.photographerName || 'Photographer'}
            </p>
          </div>
          <span className={clsx('badge ml-3 flex-shrink-0', info.cls)}>{info.label}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <FiImage className="w-4 h-4 text-gray-400" />
            {assignment.photoCount || 0} photos
          </div>
          <div className={clsx('flex items-center gap-1.5', isOverdue && 'text-red-500')}>
            <FiClock className="w-4 h-4" />
            {deadline ? formatDate(deadline) : 'No deadline'}
            {isOverdue && <span className="text-xs font-semibold">Overdue!</span>}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{info.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-white/90 to-white/70 rounded-full transition-all duration-500"
              style={{ width: `${info.progress}%` }}
            />
          </div>
        </div>

        {status === 'COMPLETED' ? (
          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-50 text-purple-600 text-sm font-medium">
            <FiCheckCircle className="w-4 h-4" /> Completed
          </div>
        ) : (
          <Link
            to={`/editor/assignments/${assignment.eventId || assignment.id}`}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-white to-white/80 text-white text-sm font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all hover:scale-[1.01]"
          >
            Start Editing <FiArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default function EditorDashboardPage() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    editorService.getAssignments()
      .then(res => setAssignments(res.data || []))
      .catch(() => toast.error('Failed to load assignments'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all'
    ? assignments
    : assignments.filter(a => {
        if (filter === 'active') return ['ACTIVE', 'EDITING'].includes(a.status)
        if (filter === 'review') return a.status === 'REVIEW'
        if (filter === 'completed') return a.status === 'COMPLETED'
        return true
      })

  const activeCount = assignments.filter(a => ['ACTIVE', 'EDITING'].includes(a.status)).length
  const completedCount = assignments.filter(a => a.status === 'COMPLETED').length

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="EDITOR" />
      <Navbar title="Editor Dashboard" />

      <main className="pt-16 lg:pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Welcome banner */}
          <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
            <div className="relative">
              <h1 className="text-2xl font-display font-bold mb-1">My Assignments</h1>
              <p className="text-blue-100 text-sm">
                {activeCount} active · {completedCount} completed
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total', value: assignments.length, color: 'text-gray-700', bg: 'bg-gray-50' },
              { label: 'Active', value: activeCount, color: 'text-emerald-700', bg: 'bg-emerald-50' },
              { label: 'Completed', value: completedCount, color: 'text-purple-700', bg: 'bg-purple-50' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-2xl p-4 text-center`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'review', label: 'In Review' },
              { key: 'completed', label: 'Completed' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                  filter === tab.key
                    ? 'bg-gradient-to-r from-white to-white/80 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-soft'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Assignments Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card p-16 text-center">
              <FiEdit3 className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No assignments found</h3>
              <p className="text-gray-400 text-sm">
                {filter === 'all' ? 'No assignments have been created yet.' : `No ${filter} assignments.`}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((assignment, i) => (
                <AssignmentCard key={assignment.id || i} assignment={assignment} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
