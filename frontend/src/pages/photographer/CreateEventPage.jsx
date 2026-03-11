import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiCheck, FiArrowRight, FiArrowLeft, FiCamera, FiCalendar, FiMapPin, FiUser, FiMail, FiPhone, FiLock, FiEye } from 'react-icons/fi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { eventService } from '../../services/eventService'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { formatDate } from '../../utils/helpers'

const STEPS = [
  { id: 1, label: 'Event Details', icon: FiCalendar },
  { id: 2, label: 'Client Details', icon: FiUser },
  { id: 3, label: 'Gallery Settings', icon: FiLock },
  { id: 4, label: 'Confirmation', icon: FiCheck },
]

const INITIAL_FORM = {
  title: '', eventDate: '', location: '', description: '',
  brideName: '', groomName: '', clientEmail: '', clientPhone: '',
  isPrivate: true, pin: '', inviteEmail: '',
}

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validateStep = () => {
    const newErrors = {}
    if (step === 1) {
      if (!form.title.trim()) newErrors.title = 'Event title is required'
      if (!form.eventDate) newErrors.eventDate = 'Event date is required'
    }
    if (step === 2) {
      if (!form.brideName.trim()) newErrors.brideName = "Bride's name is required"
      if (!form.groomName.trim()) newErrors.groomName = "Groom's name is required"
      if (form.clientEmail && !/\S+@\S+\.\S+/.test(form.clientEmail)) newErrors.clientEmail = 'Invalid email'
    }
    if (step === 3) {
      if (form.isPrivate && form.pin && form.pin.length < 4) newErrors.pin = 'PIN must be at least 4 digits'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1)
  }

  const handleBack = () => setStep(s => s - 1)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        title: form.title,
        weddingDate: form.eventDate,
        venue: form.location,
        description: form.description,
        brideName: form.brideName,
        brideEmail: form.clientEmail,
        bridePhone: form.clientPhone,
        groomName: form.groomName,
      }
      const res = await eventService.create(payload)
      toast.success('Event created successfully!')
      navigate(`/photographer/events/${res.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const InputField = ({ name, label, type = 'text', placeholder, icon: Icon, required }) => (
    <div>
      <label className="label">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input
          type={type}
          value={form[name]}
          onChange={e => set(name, e.target.value)}
          placeholder={placeholder}
          className={clsx('input', Icon && 'pl-10', errors[name] && 'border-red-400 focus:ring-red-300')}
        />
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="PHOTOGRAPHER" />
      <Navbar title="Create Event" />

      <main className="pt-16 lg:pl-64">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Back */}
          <Link to="/photographer/events" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <FiArrowLeft className="w-4 h-4" /> Back to Events
          </Link>

          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-white/90 to-white/70 z-0 transition-all duration-500"
                style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((s) => {
                const Icon = s.icon
                const isCompleted = step > s.id
                const isCurrent = step === s.id
                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                      isCompleted ? 'bg-white/10 border-white/25' :
                      isCurrent ? 'bg-white border-white/25' :
                      'bg-white border-gray-200'
                    )}>
                      {isCompleted
                        ? <FiCheck className="w-5 h-5 text-white" />
                        : <Icon className={clsx('w-4 h-4', isCurrent ? 'text-white/70' : 'text-gray-300')} />
                      }
                    </div>
                    <span className={clsx(
                      'text-xs font-medium hidden sm:block',
                      isCurrent ? 'text-white/70' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                    )}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Event Details</h2>
                  <p className="text-gray-500 text-sm">Tell us about the wedding event</p>
                </div>
                <InputField name="title" label="Event Title" placeholder="Smith & Johnson Wedding" icon={FiCamera} required />
                <InputField name="eventDate" label="Event Date" type="date" icon={FiCalendar} required />
                <InputField name="location" label="Location" placeholder="Grand Ballroom, New York" icon={FiMapPin} />
                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Brief description of the event..."
                    rows={3}
                    className="input resize-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Client Details</h2>
                  <p className="text-gray-500 text-sm">Information about the couple</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField name="brideName" label="Bride's Name" placeholder="Sarah Smith" icon={FiUser} required />
                  <InputField name="groomName" label="Groom's Name" placeholder="James Johnson" icon={FiUser} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField name="clientEmail" label="Client Email" type="email" placeholder="couple@email.com" icon={FiMail} />
                  <InputField name="clientPhone" label="Client Phone" placeholder="+1 234 567 8900" icon={FiPhone} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Gallery Settings</h2>
                  <p className="text-gray-500 text-sm">Configure access to the photo gallery</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">Private Gallery</p>
                    <p className="text-sm text-gray-500">Protect with PIN code</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set('isPrivate', !form.isPrivate)}
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors duration-200',
                      form.isPrivate ? 'bg-white/10' : 'bg-gray-300'
                    )}
                  >
                    <div className={clsx(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                      form.isPrivate ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
                {form.isPrivate && (
                  <InputField name="pin" label="Gallery PIN" type="password" placeholder="4-6 digit PIN" icon={FiLock} />
                )}
                <InputField name="inviteEmail" label="Invite via Email (optional)" type="email" placeholder="client@email.com" icon={FiMail} />
                {!form.isPrivate && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
                    <FiEye className="w-4 h-4" />
                    Gallery will be publicly accessible via link
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Confirm & Create</h2>
                  <p className="text-gray-500 text-sm">Review your event details before creating</p>
                </div>
                <div className="bg-gradient-to-br from-white to-white/80 rounded-xl p-5 border border-white/25">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <FiCamera className="text-white/70" /> {form.title}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Event Date:</span>
                      <span className="ml-2 font-medium text-gray-900">{form.eventDate ? formatDate(form.eventDate) : 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2 font-medium text-gray-900">{form.location || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Couple:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {form.brideName && form.groomName ? `${form.brideName} & ${form.groomName}` : 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Client Email:</span>
                      <span className="ml-2 font-medium text-gray-900">{form.clientEmail || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gallery:</span>
                      <span className="ml-2 font-medium text-gray-900">{form.isPrivate ? '🔒 Private (PIN protected)' : '🌐 Public'}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-700 flex items-start gap-2">
                  <span>💡</span>
                  <span>You can upload photos and send the gallery link after creating the event.</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FiArrowLeft className="w-4 h-4" /> Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all hover:scale-[1.01]"
              >
                Next <FiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? 'Creating...' : <><FiCheck className="w-4 h-4" /> Create Event</>}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
