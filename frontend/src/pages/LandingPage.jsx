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
    <span className="text-white cursor-blink">
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
      <div className="text-white/50 text-sm uppercase tracking-wider">{label}</div>
    </div>
  )
}

const FEATURES = [
  { icon: FiGrid, title: 'Smart Gallery Management', description: 'Organize thousands of wedding photos with intelligent tagging, albums, and instant search.' },
  { icon: FiSmartphone, title: 'Mobile Client Experience', description: 'Couples access their gallery anywhere with a beautiful mobile-first interface.' },
  { icon: FiEdit3, title: 'Editor Workflow Tools', description: 'Streamline editing assignments with deadline tracking and collaborative tools.' },
  { icon: FiLock, title: 'Secure Private Galleries', description: 'PIN-protected galleries ensure only the right people access precious memories.' },
  { icon: FiBarChart2, title: 'Analytics Dashboard', description: 'Track your business growth with elegant charts and actionable insights.' },
  { icon: FiCloud, title: 'Cloud Storage', description: 'Unlimited secure cloud storage with automatic backups and instant delivery.' },
]

const TESTIMONIALS = [
  { name: 'Sarah & James Mitchell', location: 'New York, NY', quote: 'WeddingSnap transformed how we relive our wedding day. The gallery is stunning and selecting our favorites was so easy!', rating: 5, initials: 'SM' },
  { name: 'Marcus Chen', location: 'San Francisco, CA', role: 'Photographer', quote: 'As a photographer, this platform has cut my delivery time in half. My clients absolutely love the gallery experience.', rating: 5, initials: 'MC' },
  { name: 'Isabella Rodriguez', location: 'Miami, FL', role: 'Photo Editor', quote: 'The editor workflow is incredible. I can manage multiple wedding projects seamlessly without missing any deadlines.', rating: 5, initials: 'IR' },
]

const USD_TO_INR_RATE = 83

const PLANS = [
  { name: 'Starter', price: 29, description: 'Perfect for new photographers', features: ['5 Active Events', '10GB Storage', 'Client Galleries', 'Email Support', 'Basic Analytics'], cta: 'Start Free Trial', highlighted: false },
  { name: 'Professional', price: 79, description: 'For growing studios', features: ['Unlimited Events', '100GB Storage', 'Editor Collaboration', 'Priority Support', 'Advanced Analytics', 'Custom Branding', 'WhatsApp Notifications'], cta: 'Start Free Trial', highlighted: true },
  { name: 'Studio', price: 149, description: 'For large photography studios', features: ['Unlimited Everything', '1TB Storage', 'Multiple Editors', 'Dedicated Support', 'White-label Solution', 'API Access', 'Custom Domain'], cta: 'Contact Sales', highlighted: false },
]

export default function LandingPage() {
  const featuresRef = useScrollReveal()
  const stepsRef = useScrollReveal()
  const testimonialsRef = useScrollReveal()
  const pricingRef = useScrollReveal()
  const [isDark, setIsDark] = useDarkMode()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black font-sans overflow-x-hidden">

      {/* ── Navigation ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-500 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/6'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center">
              <FiCamera className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl tracking-tight">WeddingSnap</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-white/50 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <Link
              to="/login"
              className="text-sm font-medium text-white/50 hover:text-white transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-glow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-black" />

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/2 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center w-full py-24">
          {/* Left: Hero copy */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-soft" />
              Trusted by 2,400+ photographers
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold text-white leading-[1.05] mb-6 tracking-tight">
              Built for{' '}
              <br />
              <TypewriterText />
            </h1>

            <p className="text-lg text-white/45 mb-10 leading-relaxed max-w-lg">
              WeddingSnap streamlines your entire wedding photography workflow — from shoot to delivery — in one elegant platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-semibold text-base hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-glow"
              >
                Start Free Trial <FiArrowRight className="w-4 h-4" />
              </Link>
              <button className="inline-flex items-center gap-3 border border-white/15 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/5 hover:border-white/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <FiPlay className="w-3 h-3 text-white ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 mt-10 pt-8 border-t border-white/6">
              <div className="flex -space-x-2">
                {['MC', 'SR', 'LK', 'PD'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white/15 bg-white/8 flex items-center justify-center text-white text-xs font-semibold"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-white gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-white/40 text-xs mt-0.5">Loved by 2,400+ photographers</p>
              </div>
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative animate-float">
              {/* Main card */}
              <div className="bg-dark-600 border border-white/8 rounded-2xl p-6 w-80 shadow-dark-card-hover">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-sm">Smith Wedding</h3>
                  <span className="bg-white/10 text-white/70 border border-white/10 text-xs px-2 py-1 rounded-full font-medium">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg aspect-square"
                      style={{
                        background: `rgba(255,255,255,${0.04 + i * 0.015})`,
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    />
                  ))}
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Photos uploaded</span>
                    <span className="font-medium text-white/80">847 / 1200</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className="bg-white/60 h-1.5 rounded-full transition-all" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>

              {/* Floating badge top-right */}
              <div className="absolute -top-4 -right-4 bg-dark-500 border border-white/8 rounded-xl p-3 shadow-dark-card animate-bounce-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <FiCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Gallery Sent</p>
                    <p className="text-sm font-semibold text-white">2 min ago</p>
                  </div>
                </div>
              </div>

              {/* Floating badge bottom-left */}
              <div
                className="absolute -bottom-4 -left-4 bg-dark-500 border border-white/8 rounded-xl p-3 shadow-dark-card animate-bounce-subtle"
                style={{ animationDelay: '-1s' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <FiStar className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">New Selection</p>
                    <p className="text-sm font-semibold text-white">127 photos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-dark-600 border-y border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter target={2400} suffix="+" label="Photographers" />
            <StatCounter target={180000} suffix="+" label="Photos Delivered" />
            <StatCounter target={4850} suffix="+" label="Happy Couples" />
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">4.9★</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-28 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={featuresRef} className="text-center mb-16 reveal">
            <span className="text-white/35 font-medium text-xs uppercase tracking-[0.25em]">Features</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4 tracking-tight">
              Everything You Need to{' '}
              <span className="gradient-text-silver">Succeed</span>
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
              A complete toolkit for wedding photographers, editors, and clients — all in one elegant platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="reveal group p-6 rounded-2xl bg-dark-600 border border-white/5 hover:border-white/12 hover:bg-dark-500 hover:-translate-y-1 transition-all duration-300 cursor-default"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                    <Icon className="w-5 h-5 text-white/70" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-28 bg-dark-700 border-y border-white/4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={stepsRef} className="text-center mb-16 reveal">
            <span className="text-white/35 font-medium text-xs uppercase tracking-[0.25em]">Process</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4 tracking-tight">
              How It <span className="gradient-text-white">Works</span>
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              From shoot to delivery in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {[
              { step: 1, title: 'Create Event & Upload', desc: 'Create a wedding event, upload your photos, and assign editors — all from one dashboard.', icon: FiCamera },
              { step: 2, title: 'Edit & Curate', desc: 'Your editor processes the photos while the couple selects their favorites from the gallery.', icon: FiEdit3 },
              { step: 3, title: 'Deliver & Delight', desc: 'Send a beautiful private gallery link. Clients download their memories in full resolution.', icon: FiStar },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="text-center reveal" style={{ transitionDelay: `${(step - 1) * 120}ms` }}>
                <div className="relative inline-flex">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white/60" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-dark-400 border border-white/12 flex items-center justify-center text-xs font-bold text-white/80">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={testimonialsRef} className="text-center mb-16 reveal">
            <span className="text-white/35 font-medium text-xs uppercase tracking-[0.25em]">Testimonials</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4 tracking-tight">
              Loved by <span className="gradient-text-silver">Thousands</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="reveal p-6 rounded-2xl bg-dark-600 border border-white/5 hover:border-white/12 hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex text-white/70 mb-4 gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <FiStar key={j} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-white/55 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-white/35 mt-0.5">{t.role || 'Client'} · {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-28 bg-dark-700 border-t border-white/4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={pricingRef} className="text-center mb-16 reveal">
            <span className="text-white/35 font-medium text-xs uppercase tracking-[0.25em]">Pricing</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4 tracking-tight">
              Simple, <span className="gradient-text-white">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-white/40">Start free, scale as you grow. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={`reveal relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-white text-black scale-[1.03] shadow-glow'
                    : 'bg-dark-600 border border-white/8 hover:border-white/15 hover:-translate-y-1'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/10">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? 'text-black' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-black/50' : 'text-white/35'}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-black' : 'text-white'}`}>
                    ₹{plan.price * USD_TO_INR_RATE}
                  </span>
                  <span className={plan.highlighted ? 'text-black/40 text-sm' : 'text-white/35 text-sm'}>/mo</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <FiCheck className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-black' : 'text-white/50'}`} />
                      <span className={`text-sm ${plan.highlighted ? 'text-black/70' : 'text-white/50'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] ${
                    plan.highlighted
                      ? 'bg-black text-white hover:bg-gray-900'
                      : 'bg-white/8 text-white border border-white/10 hover:bg-white/15'
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
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="reveal">
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Ready to Transform
              <br />
              Your Photography Business?
            </h2>
            <p className="text-lg text-white/40 mb-10">
              Join 2,400+ photographers who've already switched to WeddingSnap.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 rounded-xl font-bold text-base hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-glow"
            >
              Start Your Free Trial <FiArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-white/25 text-sm mt-4">No credit card required. 14-day free trial.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-dark-700 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center">
                <FiCamera className="w-4 h-4 text-white/70" />
              </div>
              <span className="font-display font-bold text-white text-lg">WeddingSnap</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              {['Features', 'Pricing', 'Privacy', 'Terms'].map((item) => (
                <a key={item} href="#" className="text-white/35 hover:text-white transition-colors duration-200">
                  {item}
                </a>
              ))}
              <Link to="/login" className="text-white/35 hover:text-white transition-colors duration-200">Sign In</Link>
            </div>
            <div className="flex items-center gap-4">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="text-white/30 hover:text-white transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="line-divider mt-8 mb-6" />
          <p className="text-center text-white/25 text-xs tracking-wide">
            © {new Date().getFullYear()} WeddingSnap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
