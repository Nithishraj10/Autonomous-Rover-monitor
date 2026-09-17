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
        iot: {
          dark: '#0a0f1d',
          surface: '#11192e',
          card: '#16223d',
          border: '#223259',
          lightBg: '#f4f6fa',
          lightSurface: '#ffffff',
          lightBorder: '#e2e8f0',
          accent: '#2563eb',
          accentHover: '#1d4ed8',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#06b6d4',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 2s linear infinite',
        'beacon': 'beacon 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        beacon: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
