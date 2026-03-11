import api from './api'

export const editorService = {
  getAssignments: () => api.get('/api/editor/assignments'),
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
}
