import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiLock, FiLoader, FiCamera } from 'react-icons/fi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { galleryService } from '../../services/galleryService'
import { useAuth } from '../../context/AuthContext'

export default function GalleryAccessPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { setGallerySession } = useAuth()
  const [pin, setPin] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handlePinChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newPin = [...pin]
    newPin[index] = digit
    setPin(newPin)
    setError('')
    if (digit && index < 3) {
      const next = document.getElementById(`pin-${index + 1}`)
      if (next) next.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prev = document.getElementById(`pin-${index - 1}`)
      if (prev) {
        prev.focus()
        const newPin = [...pin]
        newPin[index - 1] = ''
        setPin(newPin)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const pinValue = pin.join('')
    if (pinValue.length < 4) {
      setError('Please enter the complete PIN')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await galleryService.access(token, pinValue)
      const { galleryData, galleryToken } = response.data
      setGallerySession(galleryData || {}, galleryToken || response.data.token)
      toast.success('Gallery unlocked!')
      navigate(`/gallery/${token}/view`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Incorrect PIN. Please try again.'
      setError(msg)
      toast.error(msg)
      setPin(['', '', '', ''])
      setShake(true)
      setTimeout(() => setShake(false), 500)
      document.getElementById('pin-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4C1D95 50%, #1D4ED8 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-white/10/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/8/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className={clsx('relative w-full max-w-sm', shake && 'animate-shake')}>
        <div className="glass rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center mx-auto mb-6 shadow-glow">
            <FiCamera className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Your Wedding Gallery</h1>
          <p className="text-gray-500 text-sm mb-8">Enter your 4-digit PIN to access your photos</p>

          <form onSubmit={handleSubmit}>
            {/* PIN inputs */}
            <div className="flex gap-3 justify-center mb-6">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  id={`pin-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  autoFocus={i === 0}
                  onChange={e => handlePinChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={clsx(
                    'w-14 h-16 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all duration-200',
                    'focus:border-white/25 focus:ring-2 focus:ring-primary-200',
                    error
                      ? 'border-red-400 bg-red-50 text-red-600'
                      : digit
                      ? 'border-white/25 bg-white/10 text-white/70'
                      : 'border-gray-200 bg-white text-gray-900'
                  )}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 flex items-center justify-center gap-1">
                <span>⚠</span> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || pin.join('').length < 4}
              className="w-full bg-gradient-to-r from-white to-white/80 text-white py-3.5 rounded-xl font-semibold text-base hover:from-primary-700 hover:to-secondary-700 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <><FiLoader className="animate-spin w-5 h-5" /> Verifying...</>
              ) : (
                <><FiLock className="w-4 h-4" /> Verify & Enter Gallery</>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6">
            Don't have a PIN? Contact your photographer.
          </p>
        </div>
      </div>
    </div>
  )
}
