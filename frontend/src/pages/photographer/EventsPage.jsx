import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { eventService } from '../../services/eventService'
import { formatDate } from '../../utils/helpers'
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants'
import { FiPlus, FiCalendar, FiChevronRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventService.list()
      .then(res => setEvents(res.data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar role="PHOTOGRAPHER" />
      <main className="pt-16 md:pl-56">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-primary">My Events</h1>
            <Link to="/photographer/events/new">
              <button className="btn-primary flex items-center gap-2">
                <FiPlus /> New Event
              </button>
            </Link>
          </div>

          {loading ? <LoadingSpinner /> : (
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="card text-center py-12">
                  <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-600 mb-2">No events yet</h3>
                  <p className="text-gray-400 text-sm mb-4">Create your first wedding event to get started.</p>
                  <Link to="/photographer/events/new">
                    <button className="btn-primary">Create Event</button>
                  </Link>
                </div>
              ) : events.map(event => (
                <Link
                  key={event.id}
                  to={`/photographer/events/${event.id}`}
                  className="card-hover flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FiCalendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {event.brideName} & {event.groomName} · {formatDate(event.weddingDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={STATUS_COLORS[event.status] || 'badge-draft'}>
                      {STATUS_LABELS[event.status] || event.status}
                    </span>
                    <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
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
