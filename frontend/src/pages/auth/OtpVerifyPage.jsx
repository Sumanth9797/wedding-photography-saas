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
      const { token, user } = response.data

      setSuccess(true)
      toast.success('Verified successfully!')

      setTimeout(() => {
        login(user, token)
        const redirectMap = {
          PHOTOGRAPHER: '/photographer',
          EDITOR: '/editor',
          CLIENT: '/login',
        }
        navigate(redirectMap[user.role] || '/login')
      }, 800)
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP. Please try again.'
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
      toast.error('Failed to resend OTP')
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
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-800 to-primary-700 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-600/10 rounded-full blur-3xl" />

      <div className={clsx('relative w-full max-w-md', shake && 'animate-shake')}>
        <div className="glass rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
              <FiCamera className="w-7 h-7 text-white" />
            </div>
          </div>

          {success ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <FiCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verified!</h2>
              <p className="text-gray-500 dark:text-gray-400">Redirecting you now...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Enter Verification Code</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{maskedContact}</span>
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
                  <p className="text-center text-red-500 text-sm flex items-center justify-center gap-1">
                    <span>⚠</span> {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-xl font-semibold text-base hover:from-primary-500 hover:to-secondary-500 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
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
                    className="text-primary-600 dark:text-primary-400 font-medium hover:underline text-sm"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Resend OTP in{' '}
                    <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">{formatCountdown(countdown)}</span>
                  </p>
                )}
              </div>
            </>
          )}

          {/* Back button */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-dark-600">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
