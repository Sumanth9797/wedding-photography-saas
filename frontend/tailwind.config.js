/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          50: '#E8EFF7',
          100: '#C5D6EB',
          200: '#9EBADB',
          300: '#779ECB',
          400: '#5082BB',
          500: '#1E3A5F',
          600: '#193150',
          700: '#142841',
          800: '#0F1F32',
          900: '#0A1623',
        },
        secondary: {
          DEFAULT: '#6B4FA0',
          50: '#F0EAF8',
          100: '#D8C7EE',
          200: '#BCA1E2',
          300: '#A07BD6',
          400: '#8565CA',
          500: '#6B4FA0',
          600: '#5A4388',
          700: '#493770',
          800: '#382B58',
          900: '#271F40',
        },
        accent: {
          DEFAULT: '#D4A843',
          50: '#FBF5E6',
          100: '#F5E5B9',
          200: '#EDD38A',
          300: '#E5C15B',
          400: '#DDAF2C',
          500: '#D4A843',
          600: '#B38E38',
          700: '#92742D',
          800: '#715A22',
          900: '#504017',
        },
        background: '#F5F7FA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
