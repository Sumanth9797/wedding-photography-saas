import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FiGrid, FiSmartphone, FiEdit3, FiLock, FiBarChart2, FiCloud,
  FiPlay, FiArrowRight, FiCheck, FiStar, FiCamera,
  FiInstagram, FiTwitter, FiFacebook,
} from 'react-icons/fi'
import { useCounter } from '../hooks/useCounter'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useDarkMode } from '../hooks/useDarkMode'
import ThemeToggle from '../components/common/ThemeToggle'

const TYPEWRITER_WORDS = ['Wedding Photographers', 'Photo Editors', 'Bride & Grooms', 'Studio Owners']

function TypewriterText() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = TYPEWRITER_WORDS[wordIndex]
    const speed = isDeleting ? 50 : 80

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(word.substring(0, displayText.length + 1))
        if (displayText.length + 1 === word.length) {
          setTimeout(() => setIsDeleting(true), 1500)
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
    <span className="gradient-text cursor-blink">
      {displayText}
    </span>
  )
}

function StatCounter({ target, suffix = '', label }) {
  const { count } = useCounter(target, 2000)
  return (
    <div className="text-center">
      <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-blue-200 text-sm">{label}</div>
    </div>
  )
}

const FEATURES = [
  {
    icon: FiGrid,
    title: 'Smart Gallery Management',
    description: 'Organize thousands of wedding photos with AI-powered tagging, albums, and instant search.',
    color: 'from-blue-500 to-primary-600',
  },
  {
    icon: FiSmartphone,
    title: 'Mobile Client Experience',
    description: 'Couples access their gallery anywhere with a beautiful mobile-first interface.',
    color: 'from-secondary-500 to-purple-600',
  },
  {
    icon: FiEdit3,
    title: 'Editor Workflow Tools',
    description: 'Streamline editing assignments with deadline tracking and collaborative tools.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: FiLock,
    title: 'Secure Private Galleries',
    description: 'PIN-protected galleries ensure only the right people access precious memories.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: FiBarChart2,
    title: 'Analytics Dashboard',
    description: 'Track your business growth with beautiful charts and actionable insights.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: FiCloud,
    title: 'Cloud Storage',
    description: 'Unlimited secure cloud storage with automatic backups and instant delivery.',
    color: 'from-cyan-500 to-blue-600',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah & James Mitchell',
    location: 'New York, NY',
    quote: 'WeddingSnap transformed how we relive our wedding day. The gallery is stunning and selecting our favorites was so easy!',
    rating: 5,
    initials: 'SM',
    color: 'from-primary-500 to-secondary-500',
  },
  {
    name: 'Marcus Chen',
    location: 'San Francisco, CA',
    role: 'Photographer',
    quote: 'As a photographer, this platform has cut my delivery time in half. My clients absolutely love the gallery experience.',
    rating: 5,
    initials: 'MC',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Isabella Rodriguez',
    location: 'Miami, FL',
    role: 'Photo Editor',
    quote: 'The editor workflow is incredible. I can manage multiple wedding projects seamlessly without missing any deadlines.',
    rating: 5,
    initials: 'IR',
    color: 'from-secondary-500 to-pink-500',
  },
]

const USD_TO_INR_RATE = 83

const PLANS = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for new photographers',
    features: ['5 Active Events', '10GB Storage', 'Client Galleries', 'Email Support', 'Basic Analytics'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 79,
    description: 'For growing studios',
    features: ['Unlimited Events', '100GB Storage', 'Editor Collaboration', 'Priority Support', 'Advanced Analytics', 'Custom Branding', 'WhatsApp Notifications'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Studio',
    price: 149,
    description: 'For large photography studios',
    features: ['Unlimited Everything', '1TB Storage', 'Multiple Editors', 'Dedicated Support', 'White-label Solution', 'API Access', 'Custom Domain'],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function LandingPage() {
  const featuresRef = useScrollReveal()
  const stepsRef = useScrollReveal()
  const testimonialsRef = useScrollReveal()
  const pricingRef = useScrollReveal()
  const [isDark, setIsDark] = useDarkMode()

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 font-sans overflow-x-hidden transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-dark-600 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
              <FiCamera className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-xl">WeddingSnap</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Sign In</Link>
            <Link
              to="/login"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:from-primary-500 hover:to-secondary-500 transition-all hover:scale-[1.02] shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800" />

        {/* Blob shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Now with AI-powered photo tagging
              </div>

              <h1 className="text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
                The Ultimate Platform for{' '}
                <br />
                <TypewriterText />
              </h1>

              <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-lg">
                Streamline your wedding photography workflow — from shooting to delivery. Beautiful galleries, seamless collaboration, and delighted clients.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-[1.02] shadow-xl"
                >
                  Start Free Trial <FiArrowRight />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <FiPlay className="w-3 h-3 text-white ml-0.5" />
                  </div>
                  Watch Demo
                </a>
              </div>

              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
                <div className="flex -space-x-2">
                  {['MC', 'SR', 'LK', 'PD'].map((initials, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white/50 bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <FiStar key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-blue-200 text-sm">Loved by 2,400+ photographers</p>
                </div>
              </div>
            </div>

            {/* Right: Floating Dashboard Mockup */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative animate-float">
                {/* Main card */}
                <div className="glass rounded-2xl p-6 w-80 shadow-2xl border border-white/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Smith Wedding</h3>
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {['bg-blue-200', 'bg-purple-200', 'bg-pink-200', 'bg-amber-200', 'bg-teal-200', 'bg-indigo-200'].map((bg, i) => (
                      <div key={i} className={`${bg} rounded-lg aspect-square`} />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Photos uploaded</span>
                      <span className="font-medium text-gray-800">847 / 1200</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>

                {/* Floating stat badges */}
                <div className="absolute -top-4 -right-4 glass rounded-xl p-3 shadow-lg border border-white/30 animate-bounce-subtle">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gallery Sent</p>
                      <p className="text-sm font-bold text-gray-800">2 min ago</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 glass rounded-xl p-3 shadow-lg border border-white/30 animate-bounce-subtle" style={{ animationDelay: '-1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <FiStar className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">New Selection</p>
                      <p className="text-sm font-bold text-gray-800">127 photos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter target={2400} suffix="+" label="Photographers" />
            <StatCounter target={180000} suffix="+" label="Photos Delivered" />
            <StatCounter target={4850} suffix="+" label="Happy Couples" />
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">4.9★</div>
              <div className="text-blue-200 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={featuresRef} className="text-center mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A complete toolkit for wedding photographers, editors, and clients — all in one beautiful platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="group p-6 rounded-2xl border border-gray-100 dark:border-dark-600 bg-white dark:bg-dark-700 hover:border-primary-100 dark:hover:border-dark-500 hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-dark-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={stepsRef} className="text-center mb-16">
            <span className="text-secondary-600 dark:text-secondary-400 font-semibold text-sm uppercase tracking-wider">Process</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-2 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Get from shoot to delivery in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-300 to-secondary-300" />

            {[
              { step: 1, title: 'Create Event & Upload', desc: 'Create a wedding event, upload your photos, and assign editors — all from one dashboard.', icon: FiCamera, color: 'from-primary-500 to-primary-600' },
              { step: 2, title: 'Edit & Curate', desc: 'Your editor processes the photos while the couple selects their favorites from the gallery.', icon: FiEdit3, color: 'from-secondary-500 to-secondary-600' },
              { step: 3, title: 'Deliver & Delight', desc: 'Send a beautiful private gallery link. Clients download their memories in full resolution.', icon: FiStar, color: 'from-accent-600 to-yellow-500' },
            ].map(({ step, title, desc, icon: Icon, color }) => (
              <div key={step} className="text-center relative">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <Icon className="w-10 h-10 text-white" />
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-500 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-white">{step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={testimonialsRef} className="text-center mb-16">
            <span className="text-accent-600 dark:text-accent-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 dark:border-dark-600 bg-white dark:bg-dark-700 hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <FiStar key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-dark-700 ring-offset-1`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.role || 'Client'} · {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50 dark:bg-dark-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={pricingRef} className="text-center mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Start free, scale as you grow. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-glow scale-105'
                    : 'bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-500 hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:-translate-y-1'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-glow-gold">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>₹{plan.price * USD_TO_INR_RATE}</span>
                  <span className={plan.highlighted ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}>/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <FiCheck className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-blue-200' : 'text-primary-600 dark:text-primary-400'}`} />
                      <span className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] ${
                    plan.highlighted
                      ? 'bg-white text-primary-700 hover:bg-blue-50'
                      : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 shadow-md'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Ready to Transform Your Photography Business?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join 2,400+ photographers who've already switched to WeddingSnap.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-[1.02] shadow-xl"
          >
            Start Your Free Trial <FiArrowRight />
          </Link>
          <p className="text-blue-200 text-sm mt-4">No credit card required. 14-day free trial.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-dark-900 text-gray-400 py-12 border-t border-gray-800 dark:border-dark-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <FiCamera className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-white text-xl">WeddingSnap</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors"><FiInstagram /></a>
              <a href="#" className="hover:text-white transition-colors"><FiTwitter /></a>
              <a href="#" className="hover:text-white transition-colors"><FiFacebook /></a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © {new Date().getFullYear()} WeddingSnap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
