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
        // Primary = rose / blush pink – romantic wedding accent
        primary: {
          DEFAULT: '#F43F5E',
          50: '#FFF1F3',
          100: '#FFE4E8',
          200: '#FECDD6',
          300: '#FCA5B4',
          400: '#FB7191',
          500: '#F43F5E',  // Main accent: vivid rose
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        // Secondary = violet / lavender – romantic depth
        secondary: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',  // Main violet
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Accent = warm gold / amber – luxurious highlights
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',  // Warm gold
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // "Obsidian" palette – deep backgrounds with a hint of purple
        dark: {
          950: '#09090F', // Primary background
          900: '#0F0F1A', // Secondary sections
          800: '#16162A', // Card backgrounds
          700: '#1E1E35', // Input fields and borders
          600: '#1A1A2E',
          500: '#22223B',
          400: '#2D2D4E',
          300: '#3A3A5C',
          200: '#4A4A70',
          100: '#5C5C88',
        },
        // Wedding palette extras
        rose: {
          DEFAULT: '#F43F5E',
          light: '#FB7191',
          dark: '#BE123C',
        },
        violet: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          dark: '#5B21B6',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#B45309',
        },
        // "Intelligence" Accents
        ai: {
          glow: '#A855F7',     // Purple (AI processing)
          electric: '#3B82F6', // Blue (Logic)
          rose: '#F43F5E',     // Rose accent
        },
        background: '#09090F',
        card: '#16162A',
        'text-muted': '#9CA3AF',
        border: '#2D2D4E',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 63, 94, 0.15)' },
          '50%': { boxShadow: '0 0 60px rgba(244, 63, 94, 0.4), 0 0 100px rgba(124, 58, 237, 0.2)' },
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
        'ai-purple': '0 0 25px -5px rgba(124, 58, 237, 0.4)',
        'ai-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'premium-card': '0 20px 50px -12px rgba(0, 0, 0, 0.8)',
        'soft': '0 2px 15px rgba(0,0,0,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.7)',
        'glow': '0 0 40px rgba(244, 63, 94, 0.25)',
        'glow-sm': '0 0 20px rgba(244, 63, 94, 0.15)',
        'glow-lg': '0 0 80px rgba(244, 63, 94, 0.3)',
        'glow-purple': '0 0 40px rgba(124, 58, 237, 0.3)',
        'glow-gold': '0 0 40px rgba(245, 158, 11, 0.3)',
        'dark-card': '0 4px 24px rgba(0,0,0,0.6)',
        'dark-card-hover': '0 20px 60px rgba(0,0,0,0.8)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
        'glass-rose': '0 8px 32px rgba(244, 63, 94, 0.15)',
        'inner-glow': 'inset 0 0 30px rgba(244, 63, 94, 0.06)',
        'border-glow': '0 0 0 1px rgba(244, 63, 94, 0.3)',
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
