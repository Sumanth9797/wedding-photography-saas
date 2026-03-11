// API
export const API_URL = import.meta.env.VITE_API_URL || '/api'

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  VERIFY_OTP: '/verify-otp',
  PHOTOGRAPHER_DASHBOARD: '/photographer',
  PHOTOGRAPHER_EVENTS: '/photographer/events',
  PHOTOGRAPHER_CREATE_EVENT: '/photographer/events/new',
  PHOTOGRAPHER_ANALYTICS: '/photographer/analytics',
  EDITOR_DASHBOARD: '/editor',
  GALLERY_ACCESS: '/gallery/:token',
  GALLERY_VIEW: '/gallery/:token/view',
}

// Roles
export const ROLES = {
  PHOTOGRAPHER: 'PHOTOGRAPHER',
  EDITOR: 'EDITOR',
  CLIENT: 'CLIENT',
}

// Event Status
export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  EDITING: 'EDITING',
  REVIEW: 'REVIEW',
  COMPLETED: 'COMPLETED',
}

// Photo Status
export const PHOTO_STATUS = {
  PREVIEW: 'PREVIEW',
  SELECTED: 'SELECTED',
  EDITING: 'EDITING',
  EDITED: 'EDITED',
  APPROVED: 'APPROVED',
}

// Status labels
export const STATUS_LABELS = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  EDITING: 'Editing',
  REVIEW: 'In Review',
  COMPLETED: 'Completed',
}

// Status colors (Tailwind classes)
export const STATUS_COLORS = {
  DRAFT: 'badge-draft',
  ACTIVE: 'badge-active',
  EDITING: 'badge-editing',
  REVIEW: 'badge-review',
  COMPLETED: 'badge-completed',
}

// Navigation items per role
export const NAV_ITEMS = {
  PHOTOGRAPHER: [
    { label: 'Dashboard', path: '/photographer', icon: 'FiHome' },
    { label: 'Events', path: '/photographer/events', icon: 'FiCalendar' },
    { label: 'Analytics', path: '/photographer/analytics', icon: 'FiBarChart2' },
  ],
  EDITOR: [
    { label: 'Dashboard', path: '/editor', icon: 'FiHome' },
    { label: 'Assignments', path: '/editor', icon: 'FiEdit3' },
  ],
  CLIENT: [
    { label: 'Gallery', path: '#', icon: 'FiImage' },
  ],
}

// Notification methods
export const NOTIFICATION_METHODS = ['EMAIL', 'SMS', 'WHATSAPP']
