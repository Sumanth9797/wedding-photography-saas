import api from './api'

export const editorService = {
  getAssignments: () => api.get('/api/editor/assignments'),

  // Get a single assignment by event ID
  getAssignment: (eventId) => api.get(`/api/editor/assignments/${eventId}`),

  getAssignmentPhotos: (eventId) => api.get(`/api/editor/assignments/${eventId}/photos`),

  uploadEdited: (eventId, formData, onProgress) =>
    api.post(`/api/editor/assignments/${eventId}/upload-edited`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),

  uploadAlbum: (eventId, formData, onProgress) =>
    api.post(`/api/editor/assignments/${eventId}/upload-album`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),

  markComplete: (eventId) => api.post(`/api/editor/assignments/${eventId}/complete`),
}
