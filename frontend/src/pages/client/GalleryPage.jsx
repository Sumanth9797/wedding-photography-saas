import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiCheck, FiHeart, FiMessageSquare, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { galleryService } from '../../services/galleryService'
import PhotoGrid from '../../components/common/PhotoGrid'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

export default function GalleryPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selections, setSelections] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [comment, setComment] = useState('')
  const [showComment, setShowComment] = useState(null)

  useEffect(() => {
    galleryService.getPhotos(token)
      .then(res => setPhotos(res.data))
      .catch(() => toast.error('Failed to load gallery'))
      .finally(() => setLoading(false))

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      galleryService.getPhotos(token)
        .then(res => setPhotos(res.data))
        .catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [token])

  const handleSelectionChange = (photoId, selData) => {
    setSelections(prev => ({ ...prev, [photoId]: selData }))
  }

  const handleSubmitSelections = async () => {
    const selected = Object.entries(selections)
      .filter(([, sel]) => sel.selected)
      .map(([photoId, sel]) => ({
        photoId: Number(photoId),
        isAlbumPhoto: sel.isAlbumPhoto || false,
        comment: sel.comment || '',
      }))

    if (selected.length === 0) {
      toast.error('Please select at least one photo')
      return
    }

    setSubmitting(true)
    try {
      await galleryService.submitSelections(token, selected)
      toast.success(`${selected.length} photos selected successfully!`)
    } catch {
      toast.error('Failed to submit selections')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCount = Object.values(selections).filter(s => s.selected).length
  const albumCount = Object.values(selections).filter(s => s.selected && s.isAlbumPhoto).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-4">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <div>
            <h1 className="font-bold">Your Wedding Gallery</h1>
            <p className="text-xs text-white/70">{photos.length} photos</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p><span className="font-bold text-accent">{selectedCount}</span> selected</p>
              {albumCount > 0 && (
                <p><span className="font-bold text-secondary-300">{albumCount}</span> album</p>
              )}
            </div>
            {selectedCount > 0 && (
              <Button
                variant="accent"
                size="sm"
                loading={submitting}
                onClick={handleSubmitSelections}
              >
                <FiSend /> Submit
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="pt-20 pb-6 px-4 max-w-6xl mx-auto">
        {/* Instructions */}
        <div className="bg-white rounded-2xl p-4 mb-4 text-sm text-gray-600 flex items-start gap-3">
          <div className="flex-shrink-0 flex gap-4 text-xs">
            <span className="flex items-center gap-1"><FiCheck className="text-accent" /> Tap to select</span>
            <span className="flex items-center gap-1"><FiHeart className="text-secondary" /> Mark album</span>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <PhotoGrid
            photos={photos}
            selectable={true}
            onSelectionChange={handleSelectionChange}
            selections={selections}
          />
        )}

        {selectedCount > 0 && (
          <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-4 w-full max-w-sm">
              <div className="flex-1 text-sm">
                <span className="font-bold text-primary">{selectedCount}</span> photos selected
                {albumCount > 0 && <span className="text-secondary ml-2">· {albumCount} album</span>}
              </div>
              <Button variant="primary" size="sm" loading={submitting} onClick={handleSubmitSelections}>
                Confirm Selections
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
