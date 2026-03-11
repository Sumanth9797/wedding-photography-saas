import { format, formatDistanceToNow } from 'date-fns'

/**
 * Format date to readable string: "March 11, 2026"
 */
export const formatDate = (date) => {
  if (!date) return ''
  try {
    return format(new Date(date), 'MMMM d, yyyy')
  } catch {
    return ''
  }
}

/**
 * Format date short: "Mar 11, 2026"
 */
export const formatDateShort = (date) => {
  if (!date) return ''
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch {
    return ''
  }
}

/**
 * Time ago: "2 hours ago"
 */
export const timeAgo = (date) => {
  if (!date) return ''
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return ''
  }
}

/**
 * Get status color classes for Tailwind
 */
export const getStatusColor = (status) => {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-700',
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    EDITING: 'bg-amber-100 text-amber-700',
    REVIEW: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-purple-100 text-purple-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  }
  return colors[status?.toUpperCase()] || 'bg-gray-100 text-gray-700'
}

/**
 * Truncate string with ellipsis
 */
export const truncate = (str, length = 50) => {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Build gallery URL
 */
export const buildGalleryUrl = (token) => {
  return `${window.location.origin}/gallery/${token}`
}

/**
 * Generate a random avatar color based on name
 */
export const getAvatarColor = (name) => {
  const colors = [
    'from-primary-500 to-secondary-500',
    'from-secondary-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-blue-500 to-cyan-500',
  ]
  if (!name) return colors[0]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}
