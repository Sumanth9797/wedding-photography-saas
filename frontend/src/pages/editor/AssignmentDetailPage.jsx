import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import {
  FiArrowLeft, FiUpload, FiDownload, FiCheck, FiX,
  FiImage, FiLoader, FiCheckCircle, FiFile,
} from 'react-icons/fi'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import { editorService } from '../../services/editorService'
import { formatDate, formatFileSize, truncate } from '../../utils/helpers'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

export default function AssignmentDetailPage() {
  const { eventId } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    Promise.all([
      editorService.getAssignment(eventId),
      editorService.getAssignmentPhotos(eventId).catch(() => ({ data: [] })),
    ]).then(([assignRes, photosRes]) => {
      setAssignment(assignRes.data)
      setPhotos(photosRes.data || [])
    }).catch(() => toast.error('Failed to load assignment'))
    .finally(() => setLoading(false))
  }, [eventId])

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return
    const newFiles = acceptedFiles.map(f => ({
      file: f, name: f.name, size: f.size, progress: 0, done: false, error: false,
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
    setUploading(true)

    const formData = new FormData()
    acceptedFiles.forEach(f => formData.append('photos', f))

    try {
      await editorService.uploadEdited(eventId, formData)
      setUploadedFiles(prev =>
        prev.map(f =>
          newFiles.find(nf => nf.name === f.name)
            ? { ...f, progress: 100, done: true }
            : f
        )
      )
      toast.success('Edited photos uploaded successfully!')
    } catch {
      setUploadedFiles(prev =>
        prev.map(f =>
          newFiles.find(nf => nf.name === f.name)
            ? { ...f, error: true }
            : f
        )
      )
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }, [eventId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true,
  })

  const handleMarkComplete = async () => {
    setMarking(true)
    try {
      await editorService.markComplete(eventId)
      toast.success('Assignment marked as complete!')
      setAssignment(prev => ({ ...prev, status: 'REVIEW' }))
    } catch {
      toast.error('Failed to mark complete')
    } finally {
      setMarking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar role="EDITOR" />
        <Navbar title="Assignment" />
        <main className="pt-16 lg:pl-64 p-6">
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3"><SkeletonCard /></div>
            <div className="lg:col-span-2"><SkeletonCard /></div>
          </div>
        </main>
      </div>
    )
  }

  if (!assignment) return null

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="EDITOR" />
      <Navbar title={assignment.eventTitle || 'Assignment'} />

      <main className="pt-16 lg:pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <Link to="/editor" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 mb-6">
            <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold mb-1">{assignment.eventTitle || assignment.title}</h1>
                <p className="text-blue-100 text-sm">
                  Photographed by {assignment.photographerName || 'Photographer'} ·{' '}
                  {assignment.eventDate ? formatDate(assignment.eventDate) : 'Date TBD'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs mb-1">Photos to edit</p>
                <p className="text-3xl font-bold">{photos.length}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Photo Grid (65%) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white">Original Photos ({photos.length})</h2>
              </div>

              {photos.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                  <FiImage className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No photos available</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, i) => (
                    <div key={photo.id || i} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={photo.thumbnailUrl || photo.url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                        <a
                          href={photo.url || '#'}
                          download
                          onClick={e => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow-md transition-all hover:scale-110"
                        >
                          <FiDownload className="w-4 h-4 text-gray-700" />
                        </a>
                      </div>
                      {photo.isSelected && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center">
                          <FiCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Upload Panel (35%) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Upload Zone */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h2 className="font-bold text-gray-900 mb-4">Upload Edited Photos</h2>
                <div
                  {...getRootProps()}
                  className={clsx(
                    'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
                    isDragActive
                      ? 'border-secondary-500 bg-white/8'
                      : 'border-gray-200 hover:border-secondary-400 hover:bg-gray-50'
                  )}
                >
                  <input {...getInputProps()} />
                  <FiUpload className={clsx('w-8 h-8 mx-auto mb-2', isDragActive ? 'text-white/60' : 'text-gray-300')} />
                  <p className="font-medium text-gray-700 text-sm">
                    {isDragActive ? 'Drop here!' : 'Drag & drop edited photos'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                </div>

                {/* File list */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl text-sm">
                        <FiFile className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{truncate(f.name, 25)}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(f.size)}</p>
                          {!f.done && !f.error && (
                            <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                              <div
                                className="h-full bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full transition-all"
                                style={{ width: `${f.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                        {f.done && <FiCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                        {f.error && <FiX className="w-4 h-4 text-red-500 flex-shrink-0" />}
                        {!f.done && !f.error && <FiLoader className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignment Info */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h3 className="font-bold text-gray-900 mb-3">Assignment Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Photos</span>
                    <span className="font-medium">{photos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Uploaded</span>
                    <span className="font-medium">{uploadedFiles.filter(f => f.done).length}</span>
                  </div>
                  {assignment.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deadline</span>
                      <span className="font-medium">{formatDate(assignment.deadline)}</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Upload Progress</span>
                      <span>{Math.round((uploadedFiles.filter(f => f.done).length / uploadedFiles.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full transition-all"
                        style={{ width: `${Math.round((uploadedFiles.filter(f => f.done).length / uploadedFiles.length) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mark Complete Button */}
              {assignment.status !== 'COMPLETED' && assignment.status !== 'REVIEW' && (
                <button
                  onClick={handleMarkComplete}
                  disabled={marking || uploadedFiles.filter(f => f.done).length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {marking
                    ? <><FiLoader className="animate-spin w-4 h-4" /> Submitting...</>
                    : <><FiCheckCircle className="w-4 h-4" /> Mark as Complete</>
                  }
                </button>
              )}
              {(assignment.status === 'REVIEW' || assignment.status === 'COMPLETED') && (
                <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-500 font-medium text-sm border border-gray-200">
                  <FiCheckCircle className="w-4 h-4" /> Submitted for Review
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
