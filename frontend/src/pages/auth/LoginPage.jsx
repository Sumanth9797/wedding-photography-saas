import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiPhone, FiMail, FiCamera, FiArrowRight, FiLoader } from 'react-icons/fi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService'

const ROLES = [
  { value: 'PHOTOGRAPHER', label: 'Photographer', emoji: '📸', desc: 'Manage your events' },
  { value: 'EDITOR', label: 'Editor', emoji: '✏️', desc: 'Process assignments' },
  { value: 'CLIENT', label: 'Client', emoji: '💍', desc: 'View your gallery' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [contact, setContact] = useState('')
  const [role, setRole] = useState('PHOTOGRAPHER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [inputType, setInputType] = useState('phone') // phone or email

  const isEmail = contact.includes('@')
  const isPhone = /^\d{10,15}$/.test(contact.replace(/[\s\-+]/g, ''))

  const validate = () => {
    if (!contact.trim()) return 'Please enter your phone or email'
    if (!isEmail && !isPhone) return 'Enter a valid phone number or email'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setError('')
    setLoading(true)
    try {
      await authService.sendOtp(contact.trim(), role)
      toast.success('OTP sent successfully!')
      navigate('/verify-otp', { state: { contact: contact.trim(), role } })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.'
      setError(msg)
      toast.error(msg)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-900 via-secondary-800 to-primary-700">
        {/* Background blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-600/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <FiCamera className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-2xl">WeddingSnap</span>
          </Link>

          {/* Content */}
          <div>
            <h2 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
              Capture Every<br />Perfect Moment
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-10">
              The all-in-one platform for wedding photographers to manage events, collaborate with editors, and delight clients.
            </p>

            {/* Testimonial */}
            <div className="glass rounded-2xl p-6 border border-white/20">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-white italic text-sm leading-relaxed">
                "WeddingSnap transformed my workflow completely. My clients love the gallery experience!"
              </p>
              <p className="text-blue-300 text-xs mt-3 font-medium">— Marcus Chen, Professional Photographer</p>
            </div>
          </div>

          {/* Decorative photos grid */}
          <div className="grid grid-cols-4 gap-2">
            {['bg-primary-400/30', 'bg-secondary-400/30', 'bg-pink-400/30', 'bg-amber-400/30'].map((c, i) => (
              <div key={i} className={`${c} backdrop-blur-sm rounded-lg aspect-square`} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
              <FiCamera className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-xl">WeddingSnap</span>
          </Link>

          <div className={clsx('bg-white dark:bg-dark-700 rounded-2xl shadow-card dark:shadow-dark-card p-8 transition-colors duration-300', shake && 'animate-shake')}>
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
              <p className="text-gray-500 dark:text-gray-400">Sign in to your account with OTP</p>
            </div>

            {/* Role selection */}
            <div className="mb-6">
              <label className="label">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={clsx(
                      'flex flex-col items-center p-3 rounded-xl border-2 text-center transition-all duration-200',
                      role === r.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'border-gray-200 dark:border-dark-500 hover:border-gray-300 dark:hover:border-dark-400 text-gray-600 dark:text-gray-300'
                    )}
                  >
                    <span className="text-2xl mb-1">{r.emoji}</span>
                    <span className="text-xs font-semibold">{r.label}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 hidden md:block">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Contact input */}
              <div>
                <label className="label">Phone or Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    {isEmail ? <FiMail className="w-5 h-5" /> : <FiPhone className="w-5 h-5" />}
                  </div>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => { setContact(e.target.value); setError('') }}
                    placeholder="Enter phone or email"
                    className={clsx(
                      'input pl-10',
                      error && 'border-red-400 focus:ring-red-300'
                    )}
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-xl font-semibold text-base hover:from-primary-500 hover:to-secondary-500 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <><FiLoader className="animate-spin w-5 h-5" /> Sending OTP...</>
                ) : (
                  <>Send OTP <FiArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              New here?{' '}
              <Link to="/" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                Learn more about WeddingSnap
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            By continuing you agree to our{' '}
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 underline">Terms</a> and{' '}
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
