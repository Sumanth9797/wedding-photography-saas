import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiStar, FiThumbsUp, FiThumbsDown } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { galleryService } from '../../services/galleryService'
import Button from '../../components/common/Button'

export default function ReviewPage() {
  const { token } = useParams()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('PENDING')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await galleryService.submitReview(token, { rating, comment, status })
      setSubmitted(true)
      toast.success('Review submitted successfully!')
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Thank You!</h2>
          <p className="text-gray-500">Your review has been submitted. Your photographer has been notified.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">Review Your Photos</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="label text-center block mb-3">How satisfied are you?</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <FiStar
                    className={`w-8 h-8 ${star <= rating ? 'text-accent fill-accent' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="label">Your Decision</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('APPROVED')}
                className={`p-3 rounded-xl border-2 font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  status === 'APPROVED' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'
                }`}
              >
                <FiThumbsUp /> Approve
              </button>
              <button
                type="button"
                onClick={() => setStatus('CHANGES_REQUESTED')}
                className={`p-3 rounded-xl border-2 font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  status === 'CHANGES_REQUESTED' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'
                }`}
              >
                <FiThumbsDown /> Request Changes
              </button>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="label">Comments (optional)</label>
            <textarea
              className="input resize-none"
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your feedback..."
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  )
}
