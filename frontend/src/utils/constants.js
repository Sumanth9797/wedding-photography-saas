export const API_URL = import.meta.env.VITE_API_URL || '/api'

export const ROLES = {
  PHOTOGRAPHER: 'PHOTOGRAPHER',
  EDITOR: 'EDITOR',
  CLIENT: 'CLIENT',
}

export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  EDITING: 'EDITING',
  REVIEW: 'REVIEW',
  COMPLETED: 'COMPLETED',
}

export const PHOTO_STATUS = {
  PREVIEW: 'PREVIEW',
  SELECTED: 'SELECTED',
  EDITING: 'EDITING',
  EDITED: 'EDITED',
  APPROVED: 'APPROVED',
}

export const STATUS_LABELS = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  EDITING: 'Editing',
  REVIEW: 'In Review',
  COMPLETED: 'Completed',
}

export const STATUS_COLORS = {
  DRAFT: 'badge-draft',
  ACTIVE: 'badge-active',
  EDITING: 'badge-editing',
  REVIEW: 'badge-review',
  COMPLETED: 'badge-completed',
}

export const NOTIFICATION_METHODS = ['EMAIL', 'SMS', 'WHATSAPP']
