/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        polar: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        aurora: {
          cyan: '#00f2fe',
          teal: '#4facfe',
          green: '#10b981',
          emerald: '#059669',
          purple: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
        frost: {
          dark: '#0a0f1d',
          card: '#111827',
          cardBorder: '#1f293d',
          surface: '#151f32',
          glow: 'rgba(56, 189, 248, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'aurora-glow': 'auroraGlow 8s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        auroraGlow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(0, 242, 254, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(79, 172, 254, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
