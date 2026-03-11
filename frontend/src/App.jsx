import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

// Landing Page
import LandingPage from './pages/LandingPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import OtpVerifyPage from './pages/auth/OtpVerifyPage'

// Photographer Pages
import DashboardPage from './pages/photographer/DashboardPage'
import EventsPage from './pages/photographer/EventsPage'
import EventDetailPage from './pages/photographer/EventDetailPage'
import CreateEventPage from './pages/photographer/CreateEventPage'
import PhotosPage from './pages/photographer/PhotosPage'
import AnalyticsPage from './pages/photographer/AnalyticsPage'

// Editor Pages
import EditorDashboardPage from './pages/editor/EditorDashboardPage'
import AssignmentDetailPage from './pages/editor/AssignmentDetailPage'

// Client Pages
import GalleryAccessPage from './pages/client/GalleryAccessPage'
import GalleryPage from './pages/client/GalleryPage'
import ReviewPage from './pages/client/ReviewPage'
import DownloadPage from './pages/client/DownloadPage'

import ProtectedRoute from './components/common/ProtectedRoute'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-text-muted mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-primary">
          Go Home
        </a>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1E40AF',
                color: '#fff',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                style: {
                  background: '#059669',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#059669',
                },
              },
              error: {
                style: {
                  background: '#DC2626',
                },
              },
            }}
          />
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OtpVerifyPage />} />
            <Route path="/otp" element={<Navigate to="/verify-otp" replace />} />

            {/* Client Gallery (Public access) */}
            <Route path="/gallery/:token" element={<GalleryAccessPage />} />
            <Route path="/gallery/:token/view" element={
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            } />
            <Route path="/gallery/:token/review" element={
              <ProtectedRoute>
                <ReviewPage />
              </ProtectedRoute>
            } />
            <Route path="/gallery/:token/download" element={
              <ProtectedRoute>
                <DownloadPage />
              </ProtectedRoute>
            } />

            {/* Photographer Routes */}
            <Route path="/photographer" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/photographer/events" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <EventsPage />
              </ProtectedRoute>
            } />
            <Route path="/photographer/events/new" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <CreateEventPage />
              </ProtectedRoute>
            } />
            <Route path="/photographer/events/:id" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <EventDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/photographer/events/:id/photos" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <PhotosPage />
              </ProtectedRoute>
            } />
            <Route path="/photographer/analytics" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <AnalyticsPage />
              </ProtectedRoute>
            } />

            {/* Editor Routes */}
            <Route path="/editor" element={
              <ProtectedRoute requiredRole="EDITOR">
                <EditorDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/editor/assignments/:eventId" element={
              <ProtectedRoute requiredRole="EDITOR">
                <AssignmentDetailPage />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
