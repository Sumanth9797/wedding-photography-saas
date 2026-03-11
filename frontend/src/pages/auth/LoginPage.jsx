import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCamera, FiMail, FiPhone } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService'
import Button from '../../components/common/Button'

export default function LoginPage() {
  const [contact, setContact] = useState('')
  const [role, setRole] = useState('PHOTOGRAPHER')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!contact.trim()) {
      toast.error('Please enter your email or phone number')
      return
    }
    setLoading(true)
    try {
      await authService.sendOtp(contact.trim(), role)
      toast.success('OTP sent successfully!')
      navigate('/verify-otp', { state: { contact: contact.trim(), role } })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <FiCamera className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">WeddingSnap</h1>
          <p className="text-gray-500 mt-1">Professional Wedding Photography</p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="label">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {['PHOTOGRAPHER', 'EDITOR', 'CLIENT'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    role === r
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 text-gray-600 hover:border-primary'
                  }`}
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Input */}
          <div>
            <label className="label">Email or Phone Number</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {contact.includes('@') ? <FiMail className="w-4 h-4" /> : <FiPhone className="w-4 h-4" />}
              </div>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter email or +1234567890"
                className="input pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Send OTP
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Secure login with one-time password
        </p>
      </div>
    </div>
  )
}
