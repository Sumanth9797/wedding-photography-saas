import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { editorService } from '../../services/editorService'
import { formatDate } from '../../utils/helpers'
import { FiCamera, FiChevronRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

const statusColors = {
  PENDING: 'badge bg-yellow-100 text-yellow-700',
  ACCEPTED: 'badge bg-blue-100 text-blue-700',
  IN_PROGRESS: 'badge bg-purple-100 text-purple-700',
  COMPLETED: 'badge bg-green-100 text-green-700',
  REJECTED: 'badge bg-red-100 text-red-700',
}

export default function EditorDashboardPage() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    editorService.getAssignments()
      .then(res => setAssignments(res.data))
      .catch(() => toast.error('Failed to load assignments'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar role="EDITOR" />
      <main className="pt-16 md:pl-56">
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-6">My Assignments</h1>

          {loading ? <LoadingSpinner /> : (
            <div className="space-y-3">
              {assignments.length === 0 ? (
                <div className="card text-center py-12">
                  <FiCamera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-600 mb-2">No assignments yet</h3>
                  <p className="text-gray-400 text-sm">Assignments will appear here when photographers assign you.</p>
                </div>
              ) : assignments.map(assignment => (
                <Link
                  key={assignment.id}
                  to={`/editor/assignments/${assignment.eventId}`}
                  className="card-hover flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <FiCamera className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{assignment.eventTitle}</h3>
                      <p className="text-sm text-gray-500">
                        Wedding Date: {formatDate(assignment.weddingDate)}
                      </p>
                      {assignment.notes && (
                        <p className="text-xs text-gray-400 mt-0.5">{assignment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={statusColors[assignment.status] || statusColors.PENDING}>
                      {assignment.status?.replace('_', ' ')}
                    </span>
                    <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-secondary" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
