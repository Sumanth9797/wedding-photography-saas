import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner fullScreen />
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    const redirectMap = {
      PHOTOGRAPHER: '/photographer',
      EDITOR: '/editor',
      CLIENT: '/login',
    }
    return <Navigate to={redirectMap[user.role] || '/login'} replace />
  }

  return children
}
