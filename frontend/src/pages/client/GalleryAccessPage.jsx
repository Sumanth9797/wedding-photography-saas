import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiCamera, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { galleryService } from '../../services/galleryService'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import OtpInput from '../../components/common/OtpInput'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function GalleryAccessPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { setGallerySession } = useAuth()
  const [galleryInfo, setGalleryInfo] = useState(null)
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [authMode, setAuthMode] = useState('PIN') // PIN or OTP

  useEffect(() => {
    galleryService.getInfo(token)
      .then(res => setGalleryInfo(res.data))
      .catch(() => toast.error('Gallery not found'))
      .finally(() => setLoading(false))
  }, [token])

  const handlePinAccess = async (e) => {
    e.preventDefault()
    if (!pin || pin.length < 4) {
      toast.error('Please enter the PIN')
      return
    }
    setVerifying(true)
    try {
      const res = await authService.galleryAccess(token, pin)
      setGallerySession(res.data, res.data.token)
      toast.success('Welcome!')
      navigate(`/gallery/${token}/view`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid PIN. Please try again.')
      setPin('')
    } finally {
      setVerifying(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCamera className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-1">
            {galleryInfo?.title || 'Wedding Gallery'}
          </h1>
          {galleryInfo && (
            <p className="text-white/80 text-sm">
              {galleryInfo.brideName} & {galleryInfo.groomName}
            </p>
          )}
        </div>

        {/* Access Form */}
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiLock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-bold text-gray-800">Enter Your PIN</h2>
            <p className="text-gray-500 text-sm mt-1">
              Your photographer shared a 6-digit PIN with you
            </p>
          </div>

          <form onSubmit={handlePinAccess} className="space-y-5">
            <OtpInput length={6} value={pin} onChange={setPin} />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={verifying}
              className="w-full"
            >
              Access Gallery
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
