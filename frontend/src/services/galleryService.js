import api from './api'

export const galleryService = {
  getInfo: (token) => api.get(`/api/gallery/${token}`),
  getPhotos: (token) => api.get(`/api/gallery/${token}/photos`),
  submitSelections: (token, selections) =>
    api.post(`/api/gallery/${token}/selections`, { selections }),
  submitReview: (token, data) => api.put(`/api/gallery/${token}/review`, data),
  getDownloads: (token) => api.get(`/api/gallery/${token}/downloads`),
}
