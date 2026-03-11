import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import PageTransition from './components/common/PageTransition'

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
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

function AppRoutes() {
  const location = useLocation()
  return (
    <>
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
          <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* Landing */}
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />

            {/* Auth */}
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/verify-otp" element={<PageTransition><OtpVerifyPage /></PageTransition>} />
            <Route path="/otp" element={<Navigate to="/verify-otp" replace />} />

            {/* Client Gallery (Public access) */}
            <Route path="/gallery/:token" element={<PageTransition><GalleryAccessPage /></PageTransition>} />
            <Route path="/gallery/:token/view" element={
              <ProtectedRoute>
                <PageTransition><GalleryPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/gallery/:token/review" element={
              <ProtectedRoute>
                <PageTransition><ReviewPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/gallery/:token/download" element={
              <ProtectedRoute>
                <PageTransition><DownloadPage /></PageTransition>
              </ProtectedRoute>
            } />

            {/* Photographer Routes */}
            <Route path="/photographer" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <PageTransition><DashboardPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/photographer/events" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <PageTransition><EventsPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/photographer/events/new" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <PageTransition><CreateEventPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/photographer/events/:id" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <PageTransition><EventDetailPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/photographer/events/:id/photos" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <PageTransition><PhotosPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/photographer/analytics" element={
              <ProtectedRoute requiredRole="PHOTOGRAPHER">
                <PageTransition><AnalyticsPage /></PageTransition>
              </ProtectedRoute>
            } />

            {/* Editor Routes */}
            <Route path="/editor" element={
              <ProtectedRoute requiredRole="EDITOR">
                <PageTransition><EditorDashboardPage /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/editor/assignments/:eventId" element={
              <ProtectedRoute requiredRole="EDITOR">
                <PageTransition><AssignmentDetailPage /></PageTransition>
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
          </AnimatePresence>
    </>
  )
}

export default App
