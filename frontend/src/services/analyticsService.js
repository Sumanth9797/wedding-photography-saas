import api from './api'

export const analyticsService = {
  getOverview: () => api.get('/api/analytics/overview'),

  // Alias used by DashboardPage
  getSummary: () => api.get('/api/analytics/overview'),

  getEventAnalytics: (eventId) => api.get(`/api/analytics/events/${eventId}`),
}
