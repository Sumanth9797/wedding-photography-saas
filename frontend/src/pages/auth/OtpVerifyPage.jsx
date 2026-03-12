import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FiArrowLeft, FiLoader, FiCheck, FiCamera } from 'react-icons/fi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import OtpInput from '../../components/common/OtpInput'

export default function OtpVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const { contact, role } = location.state || {}
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [countdown, setCountdown] = useState(59)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (!contact) {
      navigate('/login')
      return
    }
  }, [contact, navigate])

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleVerify = async (e) => {
    e?.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await authService.verifyOtp(contact, otp)
      const { token, userId, role: userRole, name } = response.data
      const userData = { id: userId, role: userRole, name }

      setSuccess(true)
      toast.success('Verified successfully!')

      setTimeout(() => {
        login(userData, token)
        const redirectMap = {
          PHOTOGRAPHER: '/photographer',
          EDITOR: '/editor',
          CLIENT: '/login',
        }
        navigate(redirectMap[userRole] || '/login')
      }, 800)
    } catch (err) {
      let msg = err.response?.data?.message
      if (!msg) {
        if (err.response?.status === 400) {
          msg = 'Invalid or expired OTP. Please try again.'
        } else if (err.response?.status === 404) {
          msg = 'No account found for this contact.'
        } else {
          msg = 'Failed to verify OTP. Please try again.'
        }
      }

      setError(msg)
      toast.error(msg)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    try {
      await authService.sendOtp(contact, role)
      toast.success('New OTP sent!')
      setCountdown(59)
      setCanResend(false)
      setOtp('')
      setError('')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 503
          ? 'OTP delivery failed. Please use an email address or try again later.'
          : 'Failed to resend OTP. Please check your contact and try again.')
      toast.error(msg)
    }
  }

  // Intentionally depends only on `otp` — auto-submits when the last digit is entered
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (otp.length === 6 && !loading) {
      handleVerify()
    }
  }, [otp])

  const formatCountdown = (secs) => `00:${String(secs).padStart(2, '0')}`

  const maskedContact = contact
    ? contact.includes('@')
      ? contact.replace(/(.{2}).*(@.*)/, '$1****$2')
      : contact.replace(/(\d{2})\d+(\d{3})/, '$1****$2')
    : ''

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-white/2 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-white/2 rounded-full blur-3xl" />

      <div className={clsx('relative w-full max-w-md', shake && 'animate-shake')}>
        <div className="bg-dark-600 border border-white/8 rounded-2xl p-8 shadow-dark-card-hover">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/8 border border-white/12 flex items-center justify-center">
              <FiCamera className="w-7 h-7 text-white" />
            </div>
          </div>

          {success ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <FiCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verified!</h2>
              <p className="text-white/40">Redirecting you now...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-display font-bold text-white mb-2">Enter Verification Code</h1>
                <p className="text-white/40 text-sm">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-white/70">{maskedContact}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <OtpInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  error={!!error}
                  autoFocus
                />

                {error && (
                  <p className="text-center text-red-400/90 text-sm flex items-center justify-center gap-1">
                    <span>⚠</span> {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-white text-black py-3 rounded-xl font-semibold text-base hover:bg-gray-100 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><FiLoader className="animate-spin w-5 h-5" /> Verifying...</>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </form>

              {/* Resend */}
              <div className="text-center mt-6">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-white/60 font-medium hover:text-white transition-colors text-sm"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-white/30 text-sm">
                    Resend OTP in{' '}
                    <span className="font-semibold text-white/50 tabular-nums">{formatCountdown(countdown)}</span>
                  </p>
                )}
              </div>
            </>
          )}

          {/* Back button */}
          <div className="mt-6 pt-4 border-t border-white/6">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-white/30 hover:text-white/70 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
