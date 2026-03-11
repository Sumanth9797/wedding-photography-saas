import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { eventService } from '../../services/eventService'
import { formatDate, buildGalleryUrl } from '../../utils/helpers'
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants'
import { FiLink, FiSend, FiUserPlus, FiDownload, FiCopy, FiImage } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showEditorModal, setShowEditorModal] = useState(false)
  const [sendMethod, setSendMethod] = useState('EMAIL')
  const [editorId, setEditorId] = useState('')
  const [editorNotes, setEditorNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    eventService.get(id)
      .then(res => setEvent(res.data))
      .catch(() => toast.error('Failed to load event'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSendGalleryLink = async () => {
    setActionLoading(true)
    try {
      await eventService.sendGalleryLink(id, sendMethod)
      toast.success(`Gallery link sent via ${sendMethod}!`)
      setShowSendModal(false)
      const res = await eventService.get(id)
      setEvent(res.data)
    } catch {
      toast.error('Failed to send gallery link')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAssignEditor = async () => {
    if (!editorId) { toast.error('Please enter editor ID'); return }
    setActionLoading(true)
    try {
      await eventService.assignEditor(id, Number(editorId), editorNotes)
      toast.success('Editor assigned successfully!')
      setShowEditorModal(false)
    } catch {
      toast.error('Failed to assign editor')
    } finally {
      setActionLoading(false)
    }
  }

  const copyGalleryLink = () => {
    if (event?.galleryToken) {
      navigator.clipboard.writeText(buildGalleryUrl(event.galleryToken))
      toast.success('Gallery link copied!')
    }
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar role="PHOTOGRAPHER" />
      <main className="pt-16 md:pl-56">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">{event?.title}</h1>
              <p className="text-gray-500 text-sm">
                {event?.brideName} & {event?.groomName} · {formatDate(event?.weddingDate)}
              </p>
            </div>
            <span className={STATUS_COLORS[event?.status] || 'badge-draft'}>
              {STATUS_LABELS[event?.status] || event?.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Event Info */}
            <div className="card space-y-4">
              <h2 className="font-semibold text-gray-800">Event Details</h2>
              <div className="space-y-2 text-sm">
                {event?.venue && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Venue:</span>
                    <span className="font-medium">{event.venue}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Bride Email:</span>
                  <span className="font-medium">{event?.brideEmail || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Groom Email:</span>
                  <span className="font-medium">{event?.groomEmail || '—'}</span>
                </div>
                {event?.pinCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gallery PIN:</span>
                    <span className="font-mono font-bold text-primary">{event.pinCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Link */}
            <div className="card">
              <h2 className="font-semibold text-gray-800 mb-4">Gallery Link</h2>
              {event?.galleryToken ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 font-mono break-all">
                    {buildGalleryUrl(event.galleryToken)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyGalleryLink} className="flex-1">
                      <FiCopy /> Copy Link
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setShowSendModal(true)} className="flex-1">
                      <FiSend /> Send Link
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Actions */}
            <div className="card">
              <h2 className="font-semibold text-gray-800 mb-4">Actions</h2>
              <div className="space-y-2">
                <Link to={`/photographer/events/${id}/photos`}>
                  <Button variant="outline" className="w-full justify-start">
                    <FiImage /> Manage Photos
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start"
                  onClick={() => setShowEditorModal(true)}>
                  <FiUserPlus /> Assign Editor
                </Button>
              </div>
            </div>

            {/* Stats */}
            {event?.photoCount !== undefined && (
              <div className="card">
                <h2 className="font-semibold text-gray-800 mb-4">Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{event.photoCount || 0}</p>
                    <p className="text-xs text-gray-500">Photos</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-purple-600">{event.selectionCount || 0}</p>
                    <p className="text-xs text-gray-500">Selected</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Send Gallery Link Modal */}
      <Modal isOpen={showSendModal} onClose={() => setShowSendModal(false)} title="Send Gallery Link">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Choose how to send the gallery link to the client:</p>
          <div className="grid grid-cols-3 gap-2">
            {['EMAIL', 'SMS', 'WHATSAPP'].map(method => (
              <button key={method} onClick={() => setSendMethod(method)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  sendMethod === method ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600'
                }`}>
                {method.charAt(0) + method.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <Button variant="primary" loading={actionLoading} onClick={handleSendGalleryLink} className="w-full">
            <FiSend /> Send via {sendMethod}
          </Button>
        </div>
      </Modal>

      {/* Assign Editor Modal */}
      <Modal isOpen={showEditorModal} onClose={() => setShowEditorModal(false)} title="Assign Editor">
        <div className="space-y-4">
          <div>
            <label className="label">Editor User ID</label>
            <input className="input" type="number" value={editorId}
              onChange={e => setEditorId(e.target.value)} placeholder="Enter editor's user ID" />
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <textarea className="input resize-none" rows={3} value={editorNotes}
              onChange={e => setEditorNotes(e.target.value)}
              placeholder="Editing instructions..." />
          </div>
          <Button variant="primary" loading={actionLoading} onClick={handleAssignEditor} className="w-full">
            Assign Editor
          </Button>
        </div>
      </Modal>
    </div>
  )
}
