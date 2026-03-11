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
    <div className="min-h-screen flex bg-black">
      {/* Left panel — decorative (desktop only) */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-dark-700 border-r border-white/5">
        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/2 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-white/2 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center">
              <FiCamera className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-2xl tracking-tight">WeddingSnap</span>
          </Link>

          {/* Hero copy */}
          <div>
            <h2 className="text-5xl font-display font-bold text-white mb-6 leading-tight tracking-tight">
              Capture Every<br />Perfect Moment
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-10 max-w-sm">
              The all-in-one platform for wedding photographers to manage events, collaborate with editors, and delight clients.
            </p>

            {/* Testimonial card */}
            <div className="bg-white/4 border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex text-white/60 mb-3 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/60 italic text-sm leading-relaxed">
                "WeddingSnap transformed my workflow completely. My clients love the gallery experience!"
              </p>
              <p className="text-white/30 text-xs mt-3 font-medium">— Marcus Chen, Professional Photographer</p>
            </div>
          </div>

          {/* Monochrome photo grid */}
          <div className="grid grid-cols-4 gap-2">
            {[0.06, 0.09, 0.07, 0.05].map((opacity, i) => (
              <div
                key={i}
                className="rounded-lg aspect-square"
                style={{ background: `rgba(255,255,255,${opacity})`, border: '1px solid rgba(255,255,255,0.06)' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-black">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">
              <FiCamera className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">WeddingSnap</span>
          </Link>

          <div
            className={clsx(
              'bg-dark-600 border border-white/8 rounded-2xl shadow-dark-card p-8',
              shake && 'animate-shake'
            )}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back</h1>
              <p className="text-white/40">Sign in to your account with OTP</p>
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
                      'flex flex-col items-center p-3 rounded-xl border text-center transition-all duration-200',
                      role === r.value
                        ? 'border-white/30 bg-white/10 text-white'
                        : 'border-white/8 hover:border-white/20 text-white/45 hover:text-white/70'
                    )}
                  >
                    <span className="text-xl mb-1">{r.emoji}</span>
                    <span className="text-xs font-semibold">{r.label}</span>
                    <span className="text-xs text-white/30 hidden md:block mt-0.5">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contact input */}
              <div>
                <label className="label">Phone or Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                    {isEmail ? <FiMail className="w-4 h-4" /> : <FiPhone className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => { setContact(e.target.value); setError('') }}
                    placeholder="Enter phone or email"
                    className={clsx('input pl-10', error && 'input-error')}
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-red-400/90 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold text-base hover:bg-gray-100 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow"
              >
                {loading ? (
                  <><FiLoader className="animate-spin w-5 h-5" /> Sending OTP...</>
                ) : (
                  <>Send OTP <FiArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/30 mt-6">
              New here?{' '}
              <Link to="/" className="text-white/60 hover:text-white font-medium transition-colors">
                Learn more about WeddingSnap
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-white/20 mt-6">
            By continuing you agree to our{' '}
            <a href="#" className="hover:text-white/40 underline transition-colors">Terms</a>{' '}
            and{' '}
            <a href="#" className="hover:text-white/40 underline transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
