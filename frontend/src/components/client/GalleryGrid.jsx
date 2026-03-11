import { clsx } from 'clsx'
import { FiCheck, FiHeart } from 'react-icons/fi'

export default function GalleryGrid({ photos = [], loading = false, selectedIds = [], onToggle, cols = 4 }) {
  const colClass = { 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }[cols] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'

  if (loading) {
    return (
      <div className={clsx('grid gap-3', colClass)}>
        {Array(8).fill(0).map((_, i) => <div key={i} className="aspect-square skeleton rounded-2xl" />)}
      </div>
    )
  }

  if (!photos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <FiHeart className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-gray-500 font-semibold text-lg mb-1">No photos here</h3>
        <p className="text-gray-400 text-sm">Photos will appear once your photographer uploads them.</p>
      </div>
    )
  }

  return (
    <div className={clsx('grid gap-3', colClass)}>
      {photos.map((photo, i) => {
        const isSelected = selectedIds.includes(photo.id)
        return (
          <div key={photo.id || i} onClick={() => onToggle && onToggle(photo.id)}
            className={clsx('relative group aspect-square overflow-hidden rounded-2xl cursor-pointer transition-all duration-300', 'hover:shadow-card-hover')}
            style={isSelected ? { boxShadow: '0 0 0 3px #D4AF37, 0 0 20px rgba(212,175,55,0.3)' } : undefined}>
            <img src={photo.thumbnailUrl || photo.url} alt={photo.filename || `Photo ${i + 1}`}
              className={clsx('w-full h-full object-cover transition-transform duration-300', isSelected ? 'scale-[1.02]' : 'group-hover:scale-105')} loading="lazy" />
            <div className={clsx('absolute inset-0 transition-all duration-300', isSelected ? 'bg-amber-900/10' : 'bg-black/0 group-hover:bg-black/25')} />
            <div className={clsx('absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
              isSelected ? 'bg-accent-500 scale-100 opacity-100' : 'bg-black/30 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100')}>
              {isSelected ? <FiCheck className="w-4 h-4 text-white" /> : <FiHeart className="w-4 h-4 text-white" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
