import { useState } from 'react'
import { FiCheck, FiHeart, FiMessageSquare } from 'react-icons/fi'
import clsx from 'clsx'

export default function PhotoGrid({ photos, selectable = false, onSelectionChange, selections = {} }) {
  const [lightbox, setLightbox] = useState(null)

  const handlePhotoClick = (photo) => {
    if (selectable && onSelectionChange) {
      const current = selections[photo.id] || {}
      onSelectionChange(photo.id, { ...current, selected: !current.selected })
    } else {
      setLightbox(photo)
    }
  }

  const handleAlbumToggle = (e, photoId) => {
    e.stopPropagation()
    const current = selections[photoId] || {}
    onSelectionChange(photoId, { ...current, isAlbumPhoto: !current.isAlbumPhoto })
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {photos.map((photo) => {
          const sel = selections[photo.id] || {}
          return (
            <div
              key={photo.id}
              onClick={() => handlePhotoClick(photo)}
              className={clsx(
                'relative aspect-square rounded-xl overflow-hidden cursor-pointer photo-fade-in',
                'hover:scale-[1.02] transition-transform',
                sel.selected && 'ring-4 ring-accent'
              )}
            >
              <img
                src={photo.thumbnailUrl || photo.previewUrl}
                alt={photo.fileName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {sel.selected && (
                <div className="absolute top-2 right-2 bg-accent rounded-full w-7 h-7 flex items-center justify-center">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
              )}
              {selectable && sel.selected && (
                <button
                  onClick={(e) => handleAlbumToggle(e, photo.id)}
                  className={clsx(
                    'absolute bottom-2 left-2 rounded-full w-7 h-7 flex items-center justify-center transition-colors',
                    sel.isAlbumPhoto ? 'bg-secondary text-white' : 'bg-white/80 text-gray-600'
                  )}
                  title="Mark as album photo"
                >
                  <FiHeart className="w-4 h-4" />
                </button>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.previewUrl}
            alt={lightbox.fileName}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
