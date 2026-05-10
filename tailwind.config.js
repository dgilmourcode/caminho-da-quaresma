/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,html}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        liturgical: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        hope: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInDown: { '0%': { opacity: '0', transform: 'translateY(-24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInScale: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(30px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        floatUpDown: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        iconBounce: { '0%, 100%': { transform: 'scale(1) rotate(0deg)' }, '20%': { transform: 'scale(1.15) rotate(-5deg)' }, '40%': { transform: 'scale(1.15) rotate(5deg)' }, '60%': { transform: 'scale(1.1) rotate(-3deg)' }, '80%': { transform: 'scale(1.05) rotate(3deg)' } },
        heartBeat: { '0%': { transform: 'scale(1)' }, '25%': { transform: 'scale(1.3)' }, '50%': { transform: 'scale(1)' }, '75%': { transform: 'scale(1.3)' }, '100%': { transform: 'scale(1)' } }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-down': 'fadeInDown 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-scale': 'fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-in-right': 'slideInRight 0.6s ease forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float': 'floatUpDown 3s ease-in-out infinite',
        'icon-bounce': 'iconBounce 0.6s ease',
        'heart-beat': 'heartBeat 0.6s ease',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.03)',
        'medium': '0 10px 40px rgba(0, 0, 0, 0.06)',
        'lift': '0 20px 60px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 40px rgba(139, 92, 246, 0.15)',
      },
    },
  },
  plugins: [],
}