import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import OtpInput from '../../components/common/OtpInput'
import Button from '../../components/common/Button'
import { FiCamera } from 'react-icons/fi'

export default function OtpVerifyPage() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const { contact, role } = location.state || {}

  if (!contact) {
    navigate('/login')
    return null
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      const response = await authService.verifyOtp(contact, otp)
      const { token, userId, role: userRole, name } = response.data
      login({ id: userId, role: userRole, name }, token)
      toast.success('Welcome back!')

      const redirectMap = {
        PHOTOGRAPHER: '/photographer',
        EDITOR: '/editor',
        CLIENT: '/login',
      }
      navigate(redirectMap[userRole] || '/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.')
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await authService.sendOtp(contact, role)
      toast.success('OTP resent successfully!')
    } catch {
      toast.error('Failed to resend OTP')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <FiCamera className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Verify OTP</h1>
          <p className="text-gray-500 mt-2">
            Enter the 6-digit code sent to<br />
            <span className="font-medium text-primary">{contact}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <OtpInput length={6} value={otp} onChange={setOtp} />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Verify & Login
          </Button>

          <p className="text-center text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-medium hover:underline"
            >
              Resend OTP
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
