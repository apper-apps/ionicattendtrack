/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        secondary: {
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        },
        accent: {
          500: '#f59e0b',
          600: '#d97706',
        },
        surface: '#f8fafc',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      animation: {
        'pulse-color': 'pulse-color 0.5s ease-out',
        'scale-click': 'scale-click 0.15s ease-out',
      },
      keyframes: {
        'pulse-color': {
          '0%, 100%': { backgroundColor: 'currentColor' },
          '50%': { backgroundColor: 'rgba(37, 99, 235, 0.1)' },
        },
        'scale-click': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}