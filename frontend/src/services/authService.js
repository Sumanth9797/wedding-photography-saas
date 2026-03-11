import api from './api'

export const authService = {
  sendOtp: (contact, role = 'CLIENT') =>
    api.post('/api/auth/send-otp', { contact, role }),

  verifyOtp: (contact, otp) =>
    api.post('/api/auth/verify-otp', { contact, otp }),

  galleryAccess: (token, pin) =>
    api.post(`/api/auth/gallery-access/${token}`, { pin }),
}
