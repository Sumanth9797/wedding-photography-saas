import api from './api'
import { authService } from './authService'

const toSelectionObject = (id) =>
  typeof id === 'object' ? id : { photoId: id, isAlbumPhoto: false, comment: '' }

export const galleryService = {
  // Access gallery with token+PIN (delegates to authService)
  access: (token, pin) => authService.galleryAccess(token, pin),

  getInfo: (token) => api.get(`/api/gallery/${token}`),
  getPhotos: (token) => api.get(`/api/gallery/${token}/photos`),

  // Submit photo selections (supports both array of ids and array of selection objects)
  selectPhotos: (token, selectedIds) =>
    api.post(`/api/gallery/${token}/selections`, {
      selections: selectedIds.map(toSelectionObject),
    }),

  submitSelections: (token, selections) =>
    api.post(`/api/gallery/${token}/selections`, {
      selections: selections.map(toSelectionObject),
    }),

  submitReview: (token, data) => api.put(`/api/gallery/${token}/review`, data),
  getDownloads: (token) => api.get(`/api/gallery/${token}/downloads`),
}
