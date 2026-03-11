import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import {
  FiArrowLeft, FiUpload, FiImage, FiUsers, FiCalendar, FiMapPin,
  FiSend, FiCheck,
} from 'react-icons/fi'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import { eventService } from '../../services/eventService'
import { photoService } from '../../services/photoService'
import { formatDate, buildGalleryUrl } from '../../utils/helpers'
import { STATUS_LABELS } from '../../utils/constants'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

const STATUS_BADGE = {
  DRAFT: 'badge-draft', ACTIVE: 'badge-active', EDITING: 'badge-editing',
  REVIEW: 'badge-review', COMPLETED: 'badge-completed',
}

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedPhotos, setSelectedPhotos] = useState([])

  useEffect(() => {
    Promise.all([
      eventService.get(id),
      photoService.list(id).catch(() => ({ data: [] })),
    ]).then(([eventRes, photosRes]) => {
      setEvent(eventRes.data)
      setPhotos(photosRes.data || [])
    }).catch(() => toast.error('Failed to load event'))
    .finally(() => setLoading(false))
  }, [id])

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return
    setUploading(true)
    setUploadProgress(0)
    try {
      const formData = new FormData()
      acceptedFiles.forEach(f => formData.append('photos', f))
      formData.append('eventId', id)
      await photoService.upload(id, formData, {
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      })
      toast.success(`${acceptedFiles.length} photo(s) uploaded!`)
      const res = await photoService.list(id)
      setPhotos(res.data || [])
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [id])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    multiple: true,
  })

  const toggleSelect = (photoId) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId) ? prev.filter(pid => pid !== photoId) : [...prev, photoId]
    )
  }

  const copyGalleryLink = () => {
    if (!event?.galleryToken) {
      toast.error('Gallery token not available')
      return
    }
    navigator.clipboard.writeText(buildGalleryUrl(event.galleryToken))
    toast.success('Gallery link copied!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar role="PHOTOGRAPHER" />
        <Navbar title="Event Detail" />
        <main className="pt-16 lg:pl-64 p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4"><SkeletonCard /><SkeletonCard /></div>
            <SkeletonCard />
          </div>
        </main>
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="PHOTOGRAPHER" />
      <Navbar title={event.title} />

      <main className="pt-16 lg:pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Back */}
          <Link to="/photographer/events" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <FiArrowLeft className="w-4 h-4" /> All Events
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 mb-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-display font-bold">{event.title}</h1>
                  <span className={clsx('badge', STATUS_BADGE[event.status] || 'badge-draft')}>
                    {STATUS_LABELS[event.status] || event.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-blue-100 text-sm">
                  {event.eventDate && (
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3.5 h-3.5" /> {formatDate(event.eventDate)}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5" /> {event.location}
                    </span>
                  )}
                  {(event.brideName || event.groomName) && (
                    <span className="flex items-center gap-1">
                      <FiUsers className="w-3.5 h-3.5" /> {event.brideName} & {event.groomName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyGalleryLink}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  <FiSend className="w-4 h-4" /> Share Gallery
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main: Photo Grid */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Zone */}
              <div
                {...getRootProps()}
                className={clsx(
                  'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
                )}
              >
                <input {...getInputProps()} />
                <FiUpload className={clsx('w-10 h-10 mx-auto mb-3', isDragActive ? 'text-primary-500' : 'text-gray-300')} />
                <p className="font-semibold text-gray-700 mb-1">
                  {isDragActive ? 'Drop photos here!' : 'Upload Photos'}
                </p>
                <p className="text-sm text-gray-400">Drag & drop or click to browse — JPG, PNG, HEIC</p>
              </div>

              {uploading && (
                <div className="bg-white rounded-xl p-4 shadow-card">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Uploading...</span>
                    <span className="text-primary-600 font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Photo Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Photos ({photos.length})</h2>
                  {selectedPhotos.length > 0 && (
                    <span className="text-sm text-primary-600 font-medium">{selectedPhotos.length} selected</span>
                  )}
                </div>

                {photos.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                    <FiImage className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No photos yet</p>
                    <p className="text-sm text-gray-400">Upload photos using the zone above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {photos.map((photo, i) => {
                      const selected = selectedPhotos.includes(photo.id)
                      return (
                        <div
                          key={photo.id || i}
                          onClick={() => toggleSelect(photo.id)}
                          className={clsx(
                            'relative group aspect-square overflow-hidden rounded-xl cursor-pointer transition-all duration-200',
                            selected ? 'ring-2 ring-accent-500 ring-offset-1' : 'hover:ring-2 hover:ring-primary-300 hover:ring-offset-1'
                          )}
                        >
                          <img
                            src={photo.thumbnailUrl || photo.url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
                          {selected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center">
                              <FiCheck className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Info + Selections */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h3 className="font-bold text-gray-900 mb-4">Event Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Photos</span>
                    <span className="font-semibold text-gray-900">{photos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected</span>
                    <span className="font-semibold text-gray-900">{event.selectedCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={clsx('badge text-xs', STATUS_BADGE[event.status])}>
                      {STATUS_LABELS[event.status]}
                    </span>
                  </div>
                  {event.eventDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium text-gray-900">{formatDate(event.eventDate)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">Progress</p>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      style={{ width: `${event.status === 'COMPLETED' ? 100 : event.status === 'REVIEW' ? 85 : event.status === 'EDITING' ? 65 : event.status === 'ACTIVE' ? 40 : 10}%` }}
                    />
                  </div>
                </div>
              </div>

              {event.galleryToken && (
                <div className="bg-white rounded-2xl shadow-card p-5">
                  <h3 className="font-bold text-gray-900 mb-3">Gallery Link</h3>
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-400 break-all font-mono">
                      {buildGalleryUrl(event.galleryToken)}
                    </p>
                  </div>
                  <button
                    onClick={copyGalleryLink}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    <FiSend className="w-4 h-4" /> Copy & Share
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
