import { Link } from 'react-router-dom'
import { FiCalendar, FiImage, FiArrowRight } from 'react-icons/fi'
import { clsx } from 'clsx'
import { formatDate } from '../../utils/helpers'
import { STATUS_LABELS } from '../../utils/constants'

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  EDITING: 'bg-amber-100 text-amber-700',
  REVIEW: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-purple-100 text-purple-700',
}

const statusProgress = {
  DRAFT: 10,
  ACTIVE: 40,
  EDITING: 65,
  REVIEW: 85,
  COMPLETED: 100,
}

export default function EventCard({ event, onDelete }) {
  const status = event.status || 'DRAFT'
  const progress = statusProgress[status] || 10
  const statusColor = statusColors[status] || statusColors.DRAFT

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Top color bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${
        status === 'COMPLETED' ? 'from-purple-400 to-purple-600' :
        status === 'ACTIVE' ? 'from-emerald-400 to-emerald-600' :
        status === 'EDITING' ? 'from-amber-400 to-amber-600' :
        status === 'REVIEW' ? 'from-blue-400 to-blue-600' :
        'from-gray-200 to-gray-300'
      }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-primary-600 transition-colors">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {event.brideName && event.groomName
                ? `${event.brideName} & ${event.groomName}`
                : event.location || 'No location set'}
            </p>
          </div>
          <span className={clsx('badge ml-3 flex-shrink-0', statusColor)}>
            {STATUS_LABELS[status] || status}
          </span>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiCalendar className="w-4 h-4 text-gray-400" />
            <span>{event.eventDate ? formatDate(event.eventDate) : 'Date TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiImage className="w-4 h-4 text-gray-400" />
            <span>{event.photoCount || 0} photos</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/photographer/events/${event.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-2 rounded-xl text-sm font-medium hover:from-primary-700 hover:to-secondary-700 transition-all hover:scale-[1.01]"
          >
            View Event <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/photographer/events/${event.id}/photos`}
            className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-primary-600 transition-colors"
            title="View Photos"
          >
            <FiImage className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
