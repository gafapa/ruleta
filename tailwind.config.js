/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        neon: {
          violet: '#7C3AED',
          cyan: '#06B6D4',
          pink: '#EC4899',
          amber: '#F59E0B',
          emerald: '#10B981',
        },
      },
      keyframes: {
        'modal-pop': {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(16px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'spin-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pointer-bounce': {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0px)' },
          '50%': { transform: 'translateX(-50%) translateY(-4px)' },
        },
      },
      animation: {
        'modal-pop': 'modal-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'spin-shimmer': 'spin-shimmer 3s ease infinite',
        'fade-in': 'fade-in 0.4s ease forwards',
        'slide-in': 'slide-in 0.3s ease forwards',
        'pointer-bounce': 'pointer-bounce 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
