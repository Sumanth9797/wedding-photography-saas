import api from './api'

export const eventService = {
  create: (data) => api.post('/api/events', data),
  list: () => api.get('/api/events'),
  get: (id) => api.get(`/api/events/${id}`),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  delete: (id) => api.delete(`/api/events/${id}`),
  sendGalleryLink: (id, method) => api.post(`/api/events/${id}/send-gallery-link`, { method }),
  assignEditor: (id, editorId, notes) =>
    api.post(`/api/events/${id}/assign-editor`, { editorId, notes }),
  enableDownload: (id, clientId) =>
    api.put(`/api/events/${id}/enable-download`, { clientId }),
}
