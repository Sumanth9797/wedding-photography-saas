import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'
import { editorService } from '../../services/editorService'
import { FiUploadCloud, FiBook } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AssignmentDetailPage() {
  const { eventId } = useParams()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [editorNotes, setEditorNotes] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    editorService.getAssignmentPhotos(eventId)
      .then(res => setPhotos(res.data))
      .catch(() => toast.error('Failed to load photos'))
      .finally(() => setLoading(false))
  }, [eventId])

  const onDropEdited = useCallback(async (files) => {
    if (!selectedPhoto) { toast.error('Please select a photo first'); return }
    const file = files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('photoId', selectedPhoto.id)
      if (editorNotes) formData.append('editorNotes', editorNotes)
      await editorService.uploadEdited(eventId, formData)
      toast.success('Edited photo uploaded!')
      setSelectedPhoto(null)
      setEditorNotes('')
    } catch {
      toast.error('Failed to upload edited photo')
    } finally {
      setUploading(false)
    }
  }, [selectedPhoto, editorNotes, eventId])

  const onDropAlbum = useCallback(async (files) => {
    const file = files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (editorNotes) formData.append('editorNotes', editorNotes)
      await editorService.uploadAlbum(eventId, formData)
      toast.success('Album preview uploaded!')
    } catch {
      toast.error('Failed to upload album')
    } finally {
      setUploading(false)
    }
  }, [editorNotes, eventId])

  const { getRootProps: getEditedProps, getInputProps: getEditedInput } = useDropzone({
    onDrop: onDropEdited, accept: { 'image/*': [] }, multiple: false,
  })

  const { getRootProps: getAlbumProps, getInputProps: getAlbumInput } = useDropzone({
    onDrop: onDropAlbum, accept: { 'application/pdf': [], 'image/*': [] }, multiple: false,
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar role="EDITOR" />
      <main className="pt-16 md:pl-56">
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-6">Assignment Details</h1>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Photo List */}
            <div className="md:col-span-2">
              <div className="card">
                <h2 className="font-semibold text-gray-800 mb-4">
                  Selected Photos ({photos.length})
                </h2>
                {loading ? <LoadingSpinner /> : (
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map(photo => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${
                          selectedPhoto?.id === photo.id ? 'ring-4 ring-secondary' : 'hover:opacity-90'
                        }`}
                      >
                        <img src={photo.previewUrl} alt={photo.fileName}
                          className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Panel */}
            <div className="space-y-4">
              <div className="card">
                <h2 className="font-semibold text-gray-800 mb-3">Upload Edited Photo</h2>
                {selectedPhoto && (
                  <p className="text-xs text-secondary mb-3">Selected: {selectedPhoto.fileName}</p>
                )}
                <textarea
                  className="input resize-none mb-3 text-sm"
                  rows={2}
                  placeholder="Editor notes..."
                  value={editorNotes}
                  onChange={e => setEditorNotes(e.target.value)}
                />
                <div {...getEditedProps()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-secondary transition-colors">
                  <input {...getEditedInput()} />
                  <FiUploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Drop edited photo here</p>
                </div>
              </div>

              <div className="card">
                <h2 className="font-semibold text-gray-800 mb-3">Upload Album Preview</h2>
                <div {...getAlbumProps()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-accent transition-colors">
                  <input {...getAlbumInput()} />
                  <FiBook className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Drop album PDF/image here</p>
                </div>
              </div>

              {uploading && <LoadingSpinner />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
