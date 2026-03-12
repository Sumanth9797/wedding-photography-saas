import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FiGrid, FiSmartphone, FiEdit3, FiLock, FiBarChart2, FiCloud,
  FiPlay, FiArrowRight, FiCheck, FiStar, FiCamera,
  FiInstagram, FiTwitter, FiFacebook,
  FiZap, FiUsers, FiBookOpen, FiMessageSquare, FiX, FiThumbsUp, FiThumbsDown,
} from 'react-icons/fi'
import { useCounter } from '../hooks/useCounter'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useDarkMode, THEME_ORDER } from '../hooks/useDarkMode'
import ThemeToggle from '../components/common/ThemeToggle'


const TYPEWRITER_WORDS = ['Wedding Photographers', 'Photo Editors', 'Bride & Grooms', 'Studio Owners']

function TypewriterText() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = TYPEWRITER_WORDS[wordIndex]
    const speed = isDeleting ? 45 : 75
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(word.substring(0, displayText.length + 1))
        if (displayText.length + 1 === word.length) {
          setTimeout(() => setIsDeleting(true), 1600)
        }
      } else {
        setDisplayText(word.substring(0, displayText.length - 1))
        if (displayText.length === 0) {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length)
        }
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex])

  return (
    <span className="text-gray-900 dark:text-white cursor-blink">
      {displayText}
    </span>
  )
}

function StatCounter({ target, suffix = '', label }) {
  const { count } = useCounter(target, 2000)
  return (
    <div className="text-center">
      <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-500 dark:text-white/50 text-sm uppercase tracking-wider">{label}</div>
    </div>
  )
}

const FEATURES = [
  { icon: FiZap, title: 'AI Smart Culling', description: 'Automatically removes blurry photos, closed eyes, and duplicates — delivering a flawless gallery in seconds.', ai: true },
  { icon: FiUsers, title: 'FaceID Guest Access', description: 'Guests instantly find every photo they appear in using just a selfie — no sign-up required.', ai: true },
  { icon: FiBookOpen, title: 'Auto-Storytelling Albums', description: 'AI generates beautifully-sequenced album layouts that capture the unique vibe and emotion of each wedding.', ai: true },
  { icon: FiGrid, title: 'Smart Gallery Management', description: 'Organize thousands of wedding photos with intelligent tagging, albums, and instant search.' },
  { icon: FiEdit3, title: 'Editor Workflow Tools', description: 'Streamline editing assignments with deadline tracking and collaborative tools.' },
  { icon: FiLock, title: 'Secure Private Galleries', description: 'PIN-protected galleries ensure only the right people access precious memories.' },
  { icon: FiBarChart2, title: 'Analytics Dashboard', description: 'Track your business growth with elegant charts and actionable insights.' },
  { icon: FiSmartphone, title: 'Mobile-First Experience', description: 'Couples access their gallery anywhere with a beautiful, responsive mobile interface.' },
  { icon: FiCloud, title: 'Cloud Storage', description: 'Unlimited secure cloud storage with automatic backups and instant delivery.' },
]

const TESTIMONIALS = [
  { name: 'Sarah & James Mitchell', location: 'New York, NY', quote: 'WeddingSnap transformed how we relive our wedding day. The gallery is stunning and selecting our favorites was so easy!', rating: 5, initials: 'SM' },
  { name: 'Marcus Chen', location: 'San Francisco, CA', role: 'Photographer', quote: 'As a photographer, this platform has cut my delivery time in half. My clients absolutely love the gallery experience.', rating: 5, initials: 'MC' },
  { name: 'Isabella Rodriguez', location: 'Miami, FL', role: 'Photo Editor', quote: 'The editor workflow is incredible. I can manage multiple wedding projects seamlessly without missing any deadlines.', rating: 5, initials: 'IR' },
]

const USD_TO_INR_RATE = 83

const PLANS = [
  { name: 'Starter', price: 29, description: 'Perfect for new photographers', features: ['5 Active Events', '10GB Storage', 'Client Galleries', 'Email Support', 'Basic Analytics', 'AI Smart Culling (50 photos/mo)'], cta: 'Start Free Trial', highlighted: false },
  { name: 'Professional', price: 79, description: 'For growing studios', features: ['Unlimited Events', '100GB Storage', 'Editor Collaboration', 'Priority Support', 'Advanced Analytics', 'Custom Branding', 'WhatsApp Notifications', 'Unlimited AI Smart Culling', 'FaceID Guest Access'], cta: 'Start Free Trial', highlighted: true },
  { name: 'Studio', price: 149, description: 'For large photography studios', features: ['Unlimited Everything', '1TB Storage', 'Multiple Editors', 'Dedicated Support', 'White-label Solution', 'API Access', 'Custom Domain', 'All AI Features', 'Auto-Storytelling Albums'], cta: 'Contact Sales', highlighted: false },
]

function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('prompt') // 'prompt' | 'comment' | 'done'
  const [rating, setRating] = useState(null)
  const [comment, setComment] = useState('')

  const handleRating = (value) => {
    setRating(value)
    setStep('comment')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStep('done')
    const t = setTimeout(() => { setOpen(false); setStep('prompt'); setRating(null); setComment('') }, 2500)
    return () => clearTimeout(t)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Share feedback"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white px-4 py-3 rounded-full shadow-glow text-sm font-semibold hover:from-primary-400 hover:to-secondary-500 hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
      >
        <FiMessageSquare className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Share your feedback"
          className="fixed bottom-20 right-6 z-50 w-80 bg-white dark:bg-dark-800 border border-gray-200 dark:border-violet-900/30 rounded-2xl shadow-card p-5 animate-fade-in-up"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">How are we doing?</h3>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close feedback panel"
              className="text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              <FiX className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {step === 'prompt' && (
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={() => handleRating('positive')}
                aria-label="Thumbs up — positive feedback"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-violet-900/25 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <FiThumbsUp className="w-6 h-6 text-emerald-500" aria-hidden="true" />
                <span className="text-xs text-gray-500 dark:text-white/40">Great!</span>
              </button>
              <button
                onClick={() => handleRating('negative')}
                aria-label="Thumbs down — needs improvement"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-violet-900/25 hover:border-red-500/40 hover:bg-red-500/5 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <FiThumbsDown className="w-6 h-6 text-red-400" aria-hidden="true" />
                <span className="text-xs text-gray-500 dark:text-white/40">Needs work</span>
              </button>
            </div>
          )}

          {step === 'comment' && (
            <form onSubmit={handleSubmit}>
              <p className="text-xs text-gray-500 dark:text-white/40 mb-3">
                {rating === 'positive' ? '🎉 Glad to hear it! Any details to share?' : '😔 Sorry about that. What can we improve?'}
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Your thoughts..."
                aria-label="Feedback comment"
                rows={3}
                className="input text-sm resize-none mb-3"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-primary-400 hover:to-secondary-500 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                Send Feedback
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-3">
                <FiCheck className="w-6 h-6 text-emerald-500" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Thank you!</p>
              <p className="text-xs text-gray-400 dark:text-white/35 mt-1">Your feedback helps us improve.</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default function LandingPage() {
  const featuresRef = useScrollReveal()
  const stepsRef = useScrollReveal()
  const testimonialsRef = useScrollReveal()
  const pricingRef = useScrollReveal()
  const [theme, setTheme] = useDarkMode()
  const [scrolled, setScrolled] = useState(false)

  const cycleTheme = () => {
    setTheme(THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length])
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 font-sans overflow-x-hidden">

      {/* ── Navigation ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-dark-950/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-violet-900/20'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow-sm">
              <FiCamera className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-xl tracking-tight">WeddingSnap</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-md px-1 py-0.5"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onCycle={cycleTheme} />
            <Link
              to="/login"
              className="text-sm font-medium text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-md px-1 py-0.5"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-primary-400 hover:to-secondary-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-glow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950" />

        {/* Colorful ambient orbs */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-secondary-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center w-full py-24">
          {/* Left: Hero copy */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/25 text-primary-600 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse-soft" aria-hidden="true" />
              Trusted by 2,400+ photographers worldwide
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white leading-[1.05] mb-6 tracking-tight">
              The AI-Powered
              <br />
              Studio for{' '}
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                <TypewriterText />
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-white/55 mb-10 leading-relaxed max-w-lg">
              WeddingSnap's AI culls, organises, and delivers your wedding galleries — so you spend less time in front of a screen and more time behind a lens.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                aria-label="Start your free 14-day trial"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white px-8 py-4 rounded-xl font-semibold text-base hover:from-primary-400 hover:to-secondary-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
              >
                Start Free Trial <FiArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <button
                aria-label="Watch a product demo"
                className="inline-flex items-center gap-3 border border-gray-300 dark:border-white/15 text-gray-700 dark:text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-gray-100 dark:hover:bg-white/5 hover:border-gray-400 dark:hover:border-white/30 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
              >
                <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center" aria-hidden="true">
                  <FiPlay className="w-3 h-3 text-primary-400 ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 mt-10 pt-8 border-t border-gray-200 dark:border-violet-900/20">
              <div className="flex -space-x-2">
                {[
                  { initials: 'MC', color: 'from-primary-500 to-secondary-600' },
                  { initials: 'SR', color: 'from-secondary-600 to-secondary-800' },
                  { initials: 'LK', color: 'from-accent-500 to-primary-500' },
                  { initials: 'PD', color: 'from-secondary-500 to-primary-600' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full border-2 border-white dark:border-dark-950 bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-semibold`}
                  >
                    {item.initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-accent-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-400 dark:text-white/40 text-xs mt-0.5">Loved by 2,400+ photographers</p>
              </div>
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative animate-float">
              {/* Main card */}
              <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-violet-900/30 rounded-2xl p-6 w-80 shadow-glow-purple">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Smith Wedding</h3>
                  <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs px-2 py-1 rounded-full font-medium">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    'from-primary-500/20 to-secondary-600/20',
                    'from-secondary-600/20 to-secondary-800/20',
                    'from-accent-500/20 to-primary-500/20',
                    'from-secondary-500/20 to-primary-600/20',
                    'from-primary-500/15 to-accent-500/15',
                    'from-secondary-600/15 to-primary-500/15',
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`rounded-lg aspect-square bg-gradient-to-br ${gradient} border border-gray-200/50 dark:border-white/5`}
                    />
                  ))}
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 dark:text-white/40">Photos uploaded</span>
                    <span className="font-medium text-gray-700 dark:text-white/80">847 / 1200</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-600 h-1.5 rounded-full transition-all" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>

              {/* Floating badge top-right */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-dark-700 border border-emerald-500/25 rounded-xl p-3 shadow-lg dark:shadow-dark-card animate-bounce-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-white/40">Gallery Sent</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">2 min ago</p>
                  </div>
                </div>
              </div>

              {/* Floating badge bottom-left */}
              <div
                className="absolute -bottom-4 -left-4 bg-white dark:bg-dark-700 border border-accent-500/25 rounded-xl p-3 shadow-lg dark:shadow-dark-card animate-bounce-subtle"
                style={{ animationDelay: '-1s' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent-500/20 flex items-center justify-center">
                    <FiStar className="w-3.5 h-3.5 text-accent-500 dark:text-accent-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-white/40">New Selection</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">127 photos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-gray-100/80 dark:bg-dark-800/50 border-y border-gray-200 dark:border-violet-900/20 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter target={2400} suffix="+" label="Photographers" />
            <StatCounter target={180000} suffix="+" label="Photos Delivered" />
            <StatCounter target={4850} suffix="+" label="Happy Couples" />
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-accent-500 dark:text-accent-400 mb-1">4.9★</div>
              <div className="text-gray-500 dark:text-white/50 text-sm uppercase tracking-wider">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-28 bg-white dark:bg-dark-950" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={featuresRef} className="text-center mb-16 reveal">
            <span className="text-primary-500/70 dark:text-primary-400/70 font-medium text-xs uppercase tracking-[0.25em]">Features</span>
            <h2 id="features-heading" className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
              Everything You Need to{' '}
              <span className="gradient-text-silver">Succeed</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-white/40 max-w-2xl mx-auto leading-relaxed">
              A complete AI-powered toolkit for wedding photographers, editors, and clients — all in one elegant platform.
            </p>
          </div>

          {/* AI features highlight row */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {FEATURES.filter(f => f.ai).map((feature, i) => {
              const Icon = feature.icon
              const aiColors = [
                { bg: 'bg-secondary-600/10', border: 'border-secondary-600/25', text: 'text-secondary-400', glow: 'hover:shadow-ai-purple' },
                { bg: 'bg-blue-500/10', border: 'border-blue-500/25', text: 'text-blue-400', glow: 'hover:shadow-ai-blue' },
                { bg: 'bg-secondary-500/10', border: 'border-secondary-500/25', text: 'text-secondary-300', glow: 'hover:shadow-ai-purple' },
              ]
              const colors = aiColors[i % aiColors.length]
              return (
                <div
                  key={i}
                  className={`reveal group p-6 rounded-2xl glass-ai border border-violet-900/20 hover:border-violet-500/40 hover:-translate-y-1.5 transition-all duration-300 cursor-default ${colors.glow}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center transition-colors`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} aria-hidden="true" />
                    </div>
                    <span className="ai-badge" aria-label="AI-powered feature">
                      <span className="ai-badge-dot" aria-hidden="true" />
                      AI
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>

          {/* Standard features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.filter(f => !f.ai).map((feature, i) => {
              const Icon = feature.icon
              const iconColors = [
                { bg: 'bg-primary-500/15', border: 'border-primary-500/20', text: 'text-primary-500 dark:text-primary-400' },
                { bg: 'bg-secondary-600/15', border: 'border-secondary-600/20', text: 'text-secondary-600 dark:text-secondary-400' },
                { bg: 'bg-accent-500/15', border: 'border-accent-500/20', text: 'text-accent-600 dark:text-accent-400' },
                { bg: 'bg-secondary-400/15', border: 'border-secondary-400/20', text: 'text-secondary-600 dark:text-secondary-300' },
                { bg: 'bg-accent-400/15', border: 'border-accent-400/20', text: 'text-accent-600 dark:text-accent-300' },
                { bg: 'bg-primary-400/15', border: 'border-primary-400/20', text: 'text-primary-600 dark:text-primary-300' },
              ]
              const colors = iconColors[i % iconColors.length]
              return (
                <div
                  key={i}
                  className="reveal group p-6 rounded-2xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-violet-900/20 hover:border-violet-400/40 dark:hover:border-violet-700/40 hover:bg-gray-100 dark:hover:bg-dark-700 hover:-translate-y-1 transition-all duration-300 cursor-default"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4 transition-colors`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-28 bg-gray-50 dark:bg-dark-900 border-y border-gray-200 dark:border-violet-900/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={stepsRef} className="text-center mb-16 reveal">
            <span className="text-secondary-600/70 dark:text-secondary-400/70 font-medium text-xs uppercase tracking-[0.25em]">Process</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
              How It <span className="gradient-text-white">Works</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-white/40 max-w-2xl mx-auto">
              From shoot to delivery in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-primary-500/30 via-secondary-600/30 to-transparent" />

            {[
              { step: 1, title: 'Create Event & Upload', desc: 'Create a wedding event, upload your photos, and assign editors — all from one dashboard.', icon: FiCamera, bg: 'bg-primary-500/10', border: 'border-primary-500/25', stepGrad: 'from-primary-500 to-primary-600' },
              { step: 2, title: 'Edit & Curate', desc: 'Your editor processes the photos while the couple selects their favorites from the gallery.', icon: FiEdit3, bg: 'bg-secondary-600/10', border: 'border-secondary-600/25', stepGrad: 'from-secondary-600 to-secondary-700' },
              { step: 3, title: 'Deliver & Delight', desc: 'Send a beautiful private gallery link. Clients download their memories in full resolution.', icon: FiStar, bg: 'bg-accent-500/10', border: 'border-accent-500/25', stepGrad: 'from-accent-500 to-accent-600' },
            ].map(({ step, title, desc, icon: Icon, bg, border, stepGrad }) => (
              <div key={step} className="text-center reveal" style={{ transitionDelay: `${(step - 1) * 120}ms` }}>
                <div className="relative inline-flex">
                  <div className={`w-20 h-20 rounded-full ${bg} border ${border} flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-gray-600 dark:text-white/70" />
                  </div>
                  <span className={`absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br ${stepGrad} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28 bg-white dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={testimonialsRef} className="text-center mb-16 reveal">
            <span className="text-accent-600/70 dark:text-accent-400/70 font-medium text-xs uppercase tracking-[0.25em]">Testimonials</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
              Loved by <span className="gradient-text-silver">Thousands</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="reveal p-6 rounded-2xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-violet-900/20 hover:border-violet-400/35 dark:hover:border-violet-700/35 hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex text-accent-500 dark:text-accent-400 mb-4 gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                  {[...Array(t.rating)].map((_, j) => (
                    <FiStar key={j} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-gray-600 dark:text-white/55 text-sm leading-relaxed mb-6 italic">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                    i === 0 ? 'from-primary-500 to-secondary-600' :
                    i === 1 ? 'from-secondary-600 to-secondary-800' :
                    'from-accent-500 to-primary-500'
                  } flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`} aria-hidden="true">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">{t.role || 'Client'} · {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-28 bg-gray-50 dark:bg-dark-900 border-t border-gray-200 dark:border-violet-900/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={pricingRef} className="text-center mb-16 reveal">
            <span className="text-secondary-600/70 dark:text-secondary-400/70 font-medium text-xs uppercase tracking-[0.25em]">Pricing</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
              Simple, <span className="gradient-text-white">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-gray-500 dark:text-white/40">Start free, scale as you grow. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={`reveal relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-primary-500 to-secondary-600 scale-[1.03] shadow-glow'
                    : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-violet-900/25 hover:border-violet-400/40 dark:hover:border-violet-700/40 hover:-translate-y-1'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wide shadow-glow-gold">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white/70' : 'text-gray-500 dark:text-white/35'}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    ₹{plan.price * USD_TO_INR_RATE}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-white/60' : 'text-gray-400 dark:text-white/35'}`}>/mo</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <FiCheck className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-white' : 'text-primary-500 dark:text-primary-400'}`} />
                      <span className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-gray-600 dark:text-white/50'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] ${
                    plan.highlighted
                      ? 'bg-white text-primary-600 hover:bg-gray-50'
                      : 'bg-gradient-to-r from-primary-500/15 to-secondary-600/15 text-primary-600 dark:text-white border border-primary-500/30 hover:from-primary-500/25 hover:to-secondary-600/25'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 bg-white dark:bg-dark-950 border-t border-gray-200 dark:border-violet-900/15 relative overflow-hidden" aria-labelledby="cta-heading">
        {/* Background orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary-500/8 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-secondary-600/8 rounded-full blur-3xl" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="reveal">
            <h2 id="cta-heading" className="text-4xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              Your Next Wedding Gallery
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                Deserves to Be Perfect
              </span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-white/40 mb-2">
              Join 2,400+ photographers who deliver faster, earn more, and wow every client.
            </p>
            <p className="text-sm text-gray-400 dark:text-white/30 mb-10 italic">
              "Switched to WeddingSnap and cut delivery time from 3 days to 4 hours." — Marcus Chen, San Francisco
            </p>
            <Link
              to="/login"
              aria-label="Start your free 14-day trial, no credit card required"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white px-10 py-4 rounded-xl font-bold text-base hover:from-primary-400 hover:to-secondary-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
            >
              Start Your Free Trial <FiArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <p className="text-gray-400 dark:text-white/25 text-sm mt-4">No credit card required · 14-day free trial · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-100 dark:bg-dark-900 border-t border-gray-200 dark:border-violet-900/15 py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center" aria-hidden="true">
                <FiCamera className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-gray-900 dark:text-white text-lg">WeddingSnap</span>
            </div>
            <nav aria-label="Footer navigation">
              <div className="flex flex-wrap gap-6 text-sm">
                {['Features', 'Pricing', 'Privacy', 'Terms'].map((item) => (
                  <a key={item} href="#" className="text-gray-400 dark:text-white/35 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded">
                    {item}
                  </a>
                ))}
                <Link to="/login" className="text-gray-400 dark:text-white/35 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded">Sign In</Link>
              </div>
            </nav>
            <div className="flex items-center gap-4">
              {[
                { Icon: FiInstagram, color: 'hover:text-primary-500 dark:hover:text-primary-400', label: 'WeddingSnap on Instagram' },
                { Icon: FiTwitter, color: 'hover:text-secondary-600 dark:hover:text-secondary-400', label: 'WeddingSnap on Twitter' },
                { Icon: FiFacebook, color: 'hover:text-secondary-500 dark:hover:text-secondary-300', label: 'WeddingSnap on Facebook' },
              ].map(({ Icon, color, label }, i) => (
                <a key={i} href="#" aria-label={label} className={`text-gray-400 dark:text-white/30 ${color} transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded`}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="line-divider mt-8 mb-6" />
          <p className="text-center text-gray-400 dark:text-white/25 text-xs tracking-wide">
            © {new Date().getFullYear()} WeddingSnap. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── In-app Feedback Widget ── */}
      <FeedbackWidget />
    </div>
  )
}
