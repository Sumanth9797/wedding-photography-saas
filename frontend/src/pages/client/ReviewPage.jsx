import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiStar, FiCheck, FiX, FiMessageSquare, FiLoader } from 'react-icons/fi'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import { galleryService } from '../../services/galleryService'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button" onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)} onMouseLeave={() => !readonly && setHovered(0)}
          className={clsx('transition-all duration-100', !readonly && 'hover:scale-110 cursor-pointer', readonly && 'cursor-default')}>
          <FiStar className={clsx('w-5 h-5 transition-colors', star <= (hovered || value) ? 'text-amber-400 fill-amber-400' : 'text-gray-200')} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    galleryService.getPhotos(token)
      .then(res => {
        const edited = (res.data || []).filter(p => p.status === 'EDITED' || p.isEdited)
        setPhotos(edited.length > 0 ? edited : (res.data || []).slice(0, 12))
        const initial = {}
        res.data?.forEach(p => { initial[p.id] = { approved: null, rating: 0, comment: '', showComment: false } })
        setReviews(initial)
      })
      .catch(() => toast.error('Failed to load photos'))
      .finally(() => setLoading(false))
  }, [token])

  const setReview = (id, field, value) => setReviews(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }))

  const approvedCount = Object.values(reviews).filter(r => r.approved === true).length
  const reviewedCount = Object.values(reviews).filter(r => r.approved !== null).length
  const progressPct = photos.length > 0 ? Math.round((reviewedCount / photos.length) * 100) : 0

  const handleSubmit = async () => {
    if (reviewedCount < photos.length) {
      if (!window.confirm(`You've reviewed ${reviewedCount} of ${photos.length} photos. Submit anyway?`)) return
    }
    setSubmitting(true)
    try {
      await galleryService.submitReview(token, Object.entries(reviews).map(([photoId, r]) => ({ photoId, approved: r.approved !== false, rating: r.rating, comment: r.comment })))
      toast.success('Review submitted! Thank you!')
      navigate(`/gallery/${token}/download`)
    } catch { toast.error('Failed to submit review') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 glass border-b border-white/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-gray-900 text-lg">Review Edited Photos</h1>
            <p className="text-sm text-gray-500">{approvedCount} approved · {reviewedCount} of {photos.length} reviewed</p>
          </div>
          <button onClick={handleSubmit} disabled={submitting || reviewedCount === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50">
            {submitting ? <FiLoader className="animate-spin w-4 h-4" /> : <FiCheck className="w-4 h-4" />} Submit Final Approval
          </button>
        </div>
        <div className="max-w-6xl mx-auto mt-2">
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{reviewedCount} of {photos.length} photos reviewed ({progressPct}%)</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {photos.map((photo, i) => {
              const r = reviews[photo.id] || { approved: null, rating: 0, comment: '', showComment: false }
              return (
                <div key={photo.id || i} className={clsx('bg-white rounded-2xl overflow-hidden shadow-card transition-all duration-300', r.approved === true && 'ring-2 ring-emerald-400', r.approved === false && 'ring-2 ring-red-400')}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={photo.editedUrl || photo.url || photo.thumbnailUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-2 left-2"><span className="bg-white/8/90 text-white text-xs px-2 py-0.5 rounded-full font-medium">Edited</span></div>
                    {r.approved !== null && (
                      <div className={clsx('absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center', r.approved ? 'bg-white/8' : 'bg-red-500')}>
                        {r.approved ? <FiCheck className="w-3.5 h-3.5 text-white" /> : <FiX className="w-3.5 h-3.5 text-white" />}
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Rating</span>
                      <StarRating value={r.rating} onChange={val => setReview(photo.id, 'rating', val)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setReview(photo.id, 'approved', true)}
                        className={clsx('flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all', r.approved === true ? 'bg-white/8 text-white' : 'bg-white/8 text-white/65 hover:bg-white/8')}>
                        <FiCheck className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => { setReview(photo.id, 'approved', false); setReview(photo.id, 'showComment', true) }}
                        className={clsx('flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all', r.approved === false ? 'bg-red-500 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100')}>
                        <FiX className="w-3.5 h-3.5" /> Changes
                      </button>
                    </div>
                    {(r.showComment || r.approved === false) && (
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><FiMessageSquare className="w-3 h-3" /><span>Feedback</span></div>
                        <textarea value={r.comment} onChange={e => setReview(photo.id, 'comment', e.target.value)} placeholder="Describe the changes needed..." rows={2}
                          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-400 resize-none" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {!loading && photos.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button onClick={handleSubmit} disabled={submitting || reviewedCount === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-white to-white/80 text-white px-10 py-4 rounded-xl font-bold text-base hover:from-primary-700 hover:to-secondary-700 transition-all hover:scale-[1.02] disabled:opacity-50 shadow-lg">
              {submitting ? <FiLoader className="animate-spin w-5 h-5" /> : <FiCheck className="w-5 h-5" />}
              Submit Final Approval ({approvedCount}/{photos.length} approved)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
