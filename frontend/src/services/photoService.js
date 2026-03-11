import api from './api'

export const photoService = {
  uploadPreview: (eventId, formData, onProgress) =>
    api.post(`/api/events/${eventId}/photos/upload-preview`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),

  // Multi-file upload (used by EventDetailPage)
  upload: (eventId, formData, config) =>
    api.post(`/api/events/${eventId}/photos/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: config?.onUploadProgress,
    }),

  // Alias for getPhotos (used across pages as photoService.list)
  list: (eventId) => api.get(`/api/events/${eventId}/photos`),

  getPhotos: (eventId) => api.get(`/api/events/${eventId}/photos`),

  deletePhoto: (eventId, photoId) =>
    api.delete(`/api/events/${eventId}/photos/${photoId}`),

  updateStatus: (eventId, photoId, status) =>
    api.put(`/api/events/${eventId}/photos/${photoId}/status`, { status }),
}
