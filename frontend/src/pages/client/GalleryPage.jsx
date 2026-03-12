import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiHeart, FiCheck, FiImage, FiArrowRight } from 'react-icons/fi'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import { galleryService } from '../../services/galleryService'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

const TABS = ['All', 'Selected', 'Albums']

export default function GalleryPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])
  const [activeTab, setActiveTab] = useState('All')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    galleryService.getPhotos(token)
      .then(res => {
        const data = res.data || []
        setPhotos(data)
        setSelectedIds(data.filter(p => p.isSelected).map(p => p.id))
      })
      .catch(() => toast.error('Failed to load gallery'))
      .finally(() => setLoading(false))
  }, [token])

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleSubmit = async () => {
    if (selectedIds.length === 0) { toast.error('Please select at least one photo'); return }
    setSubmitting(true)
    try {
      await galleryService.selectPhotos(token, selectedIds)
      toast.success(`${selectedIds.length} photos selected!`)
      navigate(`/gallery/${token}/review`)
    } catch { toast.error('Failed to save selections') }
    finally { setSubmitting(false) }
  }

  const displayPhotos = activeTab === 'Selected' ? photos.filter(p => selectedIds.includes(p.id)) : photos

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 glass border-b border-white/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-gray-900 text-lg">Your Gallery</h1>
            <p className="text-sm text-gray-500">Select your favourite photos</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 px-3 py-1.5 rounded-full">
                <FiHeart className="w-4 h-4 text-accent-600" />
                <span className="text-accent-700 font-semibold text-sm">{selectedIds.length} selected</span>
              </div>
            )}
            <button onClick={handleSubmit} disabled={submitting || selectedIds.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-primary-600 hover:to-secondary-700 transition-all disabled:opacity-50">
              {submitting ? 'Saving...' : <><FiArrowRight className="w-4 h-4" /> Confirm Selection</>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeTab === tab ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-soft border border-gray-100')}>
              {tab}{tab === 'Selected' && selectedIds.length > 0 && <span className="ml-2 bg-white/30 text-xs px-1.5 py-0.5 rounded-full">{selectedIds.length}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} className="aspect-square !p-0" />)}
          </div>
        ) : displayPhotos.length === 0 ? (
          <div className="text-center py-20">
            <FiImage className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-gray-500 font-medium text-lg">{activeTab === 'Selected' ? 'No photos selected yet' : 'No photos in gallery'}</h3>
            {activeTab === 'Selected' && <button onClick={() => setActiveTab('All')} className="mt-4 text-white/70 text-sm hover:underline">Browse all photos</button>}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayPhotos.map((photo, i) => {
              const isSelected = selectedIds.includes(photo.id)
              return (
                <div key={photo.id || i} onClick={() => toggleSelect(photo.id)}
                  className={clsx('relative group aspect-square overflow-hidden rounded-2xl cursor-pointer transition-all duration-300', isSelected ? 'ring-3 ring-offset-2' : 'hover:ring-2 hover:ring-primary-300 hover:ring-offset-1')}
                  style={isSelected ? { boxShadow: '0 0 0 3px #D4AF37, 0 0 20px rgba(212, 175, 55, 0.3)' } : {}}>
                  <img src={photo.thumbnailUrl || photo.url} alt="" className={clsx('w-full h-full object-cover transition-transform duration-300', isSelected ? 'scale-[1.02]' : 'group-hover:scale-105')} loading="lazy" />
                  <div className={clsx('absolute inset-0 transition-all duration-300', isSelected ? 'bg-accent-900/20' : 'bg-black/0 group-hover:bg-black/30')} />
                  {isSelected && <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center shadow-lg"><FiCheck className="w-4 h-4 text-white" /></div>}
                  {!isSelected && <div className="absolute top-3 right-3 w-7 h-7 rounded-full border-2 border-white/60 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="glass border border-white/30 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-4">
            <FiHeart className="w-5 h-5 text-accent-600" />
            <span className="font-semibold text-gray-900">{selectedIds.length} photos selected</span>
            <button onClick={handleSubmit} disabled={submitting}
              className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-primary-600 hover:to-secondary-700 transition-all flex items-center gap-1.5">
              Confirm <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
