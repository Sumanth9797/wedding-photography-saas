/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary = white spectrum (used as main accent on dark backgrounds)
        primary: {
          DEFAULT: '#FFFFFF',
          50: '#FFFFFF',
          100: '#F5F5F5',
          200: '#EBEBEB',
          300: '#D6D6D6',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#FFFFFF',  // Main accent: pure white
          700: '#F0F0F0',
          800: '#C0C0C0',
          900: '#050505',  // Very dark for hero section backgrounds
        },
        // Secondary = silver/gray spectrum
        secondary: {
          DEFAULT: '#C0C0C0',
          50: '#FAFAFA',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#CACACA',
          400: '#AAAAAA',
          500: '#888888',
          600: '#C0C0C0',  // Silver
          700: '#707070',
          800: '#444444',
          900: '#0A0A0A',  // Very dark
        },
        // Accent = silver metallic
        accent: {
          DEFAULT: '#CCCCCC',
          50: '#FAFAFA',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#D0D0D0',
          400: '#BBBBBB',
          500: '#AAAAAA',
          600: '#CCCCCC',  // Silver accent
          700: '#999999',
          800: '#666666',
          900: '#333333',
        },
        // "Obsidian" palette - Deeper and more professional than pure black
        dark: {
          950: '#030303', // Primary background
          900: '#0A0A0B', // Secondary sections
          800: '#121214', // Card backgrounds
          700: '#1C1C1F', // Input fields and borders
          600: '#141414',
          500: '#1A1A1A',
          400: '#222222',
          300: '#2A2A2A',
          200: '#333333',
          100: '#3D3D3D',
        },
        // "Intelligence" Accents - Signifies AI features
        ai: {
          glow: '#8B5CF6',     // Amethyst (AI processing)
          electric: '#3B82F6', // Intelligence (Logic)
          silver: '#E2E8F0',   // High-contrast text
        },
        background: '#000000',
        card: '#111111',
        'text-muted': '#888888',
        border: '#222222',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        // Fade animations
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.7s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.7s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.7s ease-out forwards',
        // Slide animations
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in': 'slideIn 0.5s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        // Scale animations
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'scale-in-fast': 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards',
        // Shimmer / loading
        'shimmer': 'shimmer 2s linear infinite',
        'shimmer-fast': 'shimmer 1.2s linear infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'skeleton': 'skeletonWave 1.6s ease-in-out infinite',
        // Motion
        'float': 'float 6s ease-in-out infinite',
        'ai-pulse': 'aiPulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'bounce-subtle-delayed': 'bounceSubtle 2s ease-in-out 0.4s infinite',
        // Glow / pulse
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spinReverse 6s linear infinite',
        // Gradient
        'gradient-shift': 'gradientShift 6s ease infinite',
        // Text
        'blink': 'blink 1s infinite',
        // Swipe
        'swipe-in-right': 'swipeInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'swipe-in-left': 'swipeInLeft 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'swipe-out-right': 'swipeOutRight 0.3s ease-in forwards',
        'swipe-out-left': 'swipeOutLeft 0.3s ease-in forwards',
        // Stagger helpers
        'stagger-1': 'fadeInUp 0.7s ease-out 0.1s forwards',
        'stagger-2': 'fadeInUp 0.7s ease-out 0.2s forwards',
        'stagger-3': 'fadeInUp 0.7s ease-out 0.3s forwards',
        'stagger-4': 'fadeInUp 0.7s ease-out 0.4s forwards',
        'stagger-5': 'fadeInUp 0.7s ease-out 0.5s forwards',
      },
      keyframes: {
        aiPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)', filter: 'blur(8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        skeletonWave: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,255,255,0.08)' },
          '50%': { boxShadow: '0 0 60px rgba(255,255,255,0.2), 0 0 100px rgba(255,255,255,0.06)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        swipeInRight: {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        swipeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        swipeOutRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(60px)' },
        },
        swipeOutLeft: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-60px)' },
        },
      },
      boxShadow: {
        // Glowing shadows for AI-powered components
        'ai-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'ai-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'premium-card': '0 20px 50px -12px rgba(0, 0, 0, 0.8)',
        'soft': '0 2px 15px rgba(0,0,0,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.7)',
        'glow': '0 0 40px rgba(255,255,255,0.12)',
        'glow-sm': '0 0 20px rgba(255,255,255,0.08)',
        'glow-lg': '0 0 80px rgba(255,255,255,0.15)',
        'glow-purple': '0 0 40px rgba(200,200,200,0.12)',
        'glow-gold': '0 0 40px rgba(220,220,220,0.12)',
        'dark-card': '0 4px 24px rgba(0,0,0,0.6)',
        'dark-card-hover': '0 20px 60px rgba(0,0,0,0.8)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
        'glass-white': '0 8px 32px rgba(255,255,255,0.06)',
        'inner-glow': 'inset 0 0 30px rgba(255,255,255,0.04)',
        'border-glow': '0 0 0 1px rgba(255,255,255,0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
}
