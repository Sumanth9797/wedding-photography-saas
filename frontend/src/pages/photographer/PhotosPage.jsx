import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import PhotoGrid from '../../components/common/PhotoGrid'
import Button from '../../components/common/Button'
import { photoService } from '../../services/photoService'
import { compressImage, isValidImage } from '../../utils/imageUtils'
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function PhotosPage() {
  const { id: eventId } = useParams()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

  const loadPhotos = async () => {
    try {
      const res = await photoService.getPhotos(eventId)
      setPhotos(res.data)
    } catch {
      toast.error('Failed to load photos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPhotos() }, [eventId])

  const onDrop = useCallback(async (acceptedFiles) => {
    const validFiles = acceptedFiles.filter(isValidImage)
    if (validFiles.length === 0) {
      toast.error('Please upload valid image files (JPEG, PNG, WebP)')
      return
    }

    setUploading(true)
    const total = validFiles.length
    let completed = 0

    for (const file of validFiles) {
      try {
        // Compress image before upload
        const compressed = await compressImage(file, 1920, 0.85)
        const formData = new FormData()
        formData.append('file', compressed)

        await photoService.uploadPreview(eventId, formData, (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(prev => ({ ...prev, [file.name]: pct }))
        })
        completed++
        toast.success(`${completed}/${total} photos uploaded`)
      } catch {
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    setUploading(false)
    setUploadProgress({})
    loadPhotos()
  }, [eventId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true,
  })

  const handleDelete = async (photoId) => {
    if (!confirm('Delete this photo?')) return
    try {
      await photoService.deletePhoto(eventId, photoId)
      setPhotos(prev => prev.filter(p => p.id !== photoId))
      toast.success('Photo deleted')
    } catch {
      toast.error('Failed to delete photo')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar role="PHOTOGRAPHER" />
      <main className="pt-16 md:pl-56">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-primary">Photos</h1>
            <span className="text-sm text-gray-500">{photos.length} photos</span>
          </div>

          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <FiUploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-gray-700">
              {isDragActive ? 'Drop photos here...' : 'Drag & drop photos or click to browse'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Photos will be compressed automatically before upload
            </p>
            {uploading && (
              <div className="mt-4">
                <LoadingSpinner size="sm" />
                <p className="text-sm text-primary mt-2">Uploading...</p>
              </div>
            )}
          </div>

          {/* Photos Grid */}
          {loading ? <LoadingSpinner /> : (
            photos.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">No photos uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {photos.map(photo => (
                  <div key={photo.id} className="relative aspect-square group">
                    <img
                      src={photo.thumbnailUrl || photo.previewUrl}
                      alt={photo.fileName}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className={`absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                      photo.status === 'SELECTED' ? 'bg-accent text-white' :
                      photo.status === 'EDITED' ? 'bg-green-500 text-white' :
                      'bg-black/60 text-white'
                    }`}>
                      {photo.status}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}
