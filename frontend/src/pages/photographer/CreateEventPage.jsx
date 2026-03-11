import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Button from '../../components/common/Button'
import { eventService } from '../../services/eventService'
import toast from 'react-hot-toast'
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'

const steps = ['Event Details', 'Couple Details', 'Review & Create']

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', weddingDate: '', venue: '', description: '',
    brideName: '', bridePhone: '', brideEmail: '',
    groomName: '', groomPhone: '', groomEmail: '',
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await eventService.create({
        ...form,
        weddingDate: form.weddingDate,
      })
      toast.success('Event created successfully!')
      navigate(`/photographer/events/${res.data.id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar role="PHOTOGRAPHER" />
      <main className="pt-16 md:pl-56">
        <div className="p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-6">Create New Event</h1>

          {/* Step Indicator */}
          <div className="flex items-center mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>{i + 1}</div>
                {i < steps.length - 1 && (
                  <div className={`h-1 w-16 mx-1 rounded ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="card">
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-800 mb-4">{steps[0]}</h2>
                <div>
                  <label className="label">Event Title *</label>
                  <input className="input" value={form.title}
                    onChange={e => update('title', e.target.value)}
                    placeholder="Sarah & John's Wedding" />
                </div>
                <div>
                  <label className="label">Wedding Date *</label>
                  <input type="date" className="input" value={form.weddingDate}
                    onChange={e => update('weddingDate', e.target.value)} />
                </div>
                <div>
                  <label className="label">Venue</label>
                  <input className="input" value={form.venue}
                    onChange={e => update('venue', e.target.value)}
                    placeholder="Grand Ballroom, NYC" />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea className="input resize-none" rows={3} value={form.description}
                    onChange={e => update('description', e.target.value)}
                    placeholder="Optional notes..." />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-800 mb-4">{steps[1]}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-secondary mb-3">Bride</h3>
                    <div className="space-y-3">
                      <input className="input" placeholder="Full name *" value={form.brideName}
                        onChange={e => update('brideName', e.target.value)} />
                      <input className="input" placeholder="Phone" value={form.bridePhone}
                        onChange={e => update('bridePhone', e.target.value)} />
                      <input className="input" type="email" placeholder="Email" value={form.brideEmail}
                        onChange={e => update('brideEmail', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary mb-3">Groom</h3>
                    <div className="space-y-3">
                      <input className="input" placeholder="Full name *" value={form.groomName}
                        onChange={e => update('groomName', e.target.value)} />
                      <input className="input" placeholder="Phone" value={form.groomPhone}
                        onChange={e => update('groomPhone', e.target.value)} />
                      <input className="input" type="email" placeholder="Email" value={form.groomEmail}
                        onChange={e => update('groomEmail', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-800 mb-4">Review Details</h2>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Title:</span>
                    <span className="font-medium">{form.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{form.weddingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Venue:</span>
                    <span className="font-medium">{form.venue || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bride:</span>
                    <span className="font-medium">{form.brideName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Groom:</span>
                    <span className="font-medium">{form.groomName}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => step > 0 ? setStep(s => s - 1) : null}
                disabled={step === 0}>
                <FiChevronLeft /> Back
              </Button>
              {step < steps.length - 1 ? (
                <Button variant="primary" onClick={() => setStep(s => s + 1)}
                  disabled={
                    (step === 0 && (!form.title || !form.weddingDate)) ||
                    (step === 1 && (!form.brideName || !form.groomName))
                  }>
                  Next <FiChevronRight />
                </Button>
              ) : (
                <Button variant="primary" loading={loading} onClick={handleSubmit}>
                  Create Event
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
