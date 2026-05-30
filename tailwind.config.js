/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fintech: {
          teal: '#14b8a6',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          navy: '#0f172a',
          dark: '#030712',
          surface: '#111827',
          card: '#1e293b',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ticker': 'ticker 30s linear infinite',
        'data-stream': 'dataStream 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(20,184,166,0.2), 0 0 20px rgba(20,184,166,0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(20,184,166,0.4), 0 0 60px rgba(20,184,166,0.2)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        dataStream: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(20,184,166,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.03) 1px, transparent 1px)',
        'grid-pattern-light': 'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
    },
  },
  plugins: [],
}
