import { useState } from 'react'
import { clsx } from 'clsx'
import { FiImage } from 'react-icons/fi'
import { SkeletonCard } from './LoadingSpinner'

export default function PhotoGrid({
  photos = [],
  loading = false,
  onPhotoClick,
  selectable = false,
  selectedIds = [],
  onSelect,
  emptyMessage = 'No photos yet',
  cols = 4,
}) {
  const colsClass = {
    2: 'grid-cols-2 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[cols] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'

  if (loading) {
    return (
      <div className={clsx('grid gap-3', colsClass)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} className="!p-0" />
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <FiImage className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-gray-500 font-medium mb-1">{emptyMessage}</h3>
        <p className="text-gray-400 text-sm">Upload photos to get started</p>
      </div>
    )
  }

  return (
    <div className={clsx('grid gap-3', colsClass)}>
      {photos.map((photo, i) => {
        const isSelected = selectedIds.includes(photo.id)
        return (
          <div
            key={photo.id || i}
            onClick={() => {
              if (selectable && onSelect) onSelect(photo.id)
              else if (onPhotoClick) onPhotoClick(photo, i)
            }}
            className={clsx(
              'relative group aspect-square overflow-hidden rounded-xl cursor-pointer transition-all duration-300',
              isSelected ? 'ring-2 ring-accent-600 ring-offset-1' : 'ring-0',
              'hover:shadow-card-hover'
            )}
          >
            <img
              src={photo.thumbnailUrl || photo.url || photo.previewUrl}
              alt={photo.filename || `Photo ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className={clsx(
              'absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center',
              isSelected && 'bg-black/20'
            )}>
              {isSelected && (
                <div className="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
