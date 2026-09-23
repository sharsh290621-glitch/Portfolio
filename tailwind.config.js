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
        studio: {
          bg: '#F5F3EE',
          'bg-dark': '#0D0E12',
          surface: '#FFFFFF',
          'surface-dark': '#15161E',
          card: '#FAF9F6',
          'card-dark': '#1A1C26',
          dark: '#111111',
          'light-text': '#F5F3EE',
          muted: '#666666',
          'muted-dark': '#9598A6',
          subtle: '#888888',
          'subtle-dark': '#656877',
          border: '#D7D4CC',
          'border-dark': '#262838',
          'border-light': '#E5E2D9',
          blue: '#0055FF',
          'blue-dark': '#0040C1',
          'blue-soft': '#EEF4FF',
          yellow: '#FFF7D6',
          'yellow-border': '#EADB99',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Unbounded"', '"Syne"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.025em',
        widest: '0.12em',
        ultra: '0.22em',
      },
      boxShadow: {
        'window': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'window-dark': '0 15px 35px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'window-hover': '0 20px 40px -12px rgba(0, 0, 0, 0.14), 0 8px 12px -4px rgba(0, 0, 0, 0.06)',
        'drag': '0 30px 60px -15px rgba(0, 0, 0, 0.22), 0 12px 20px -6px rgba(0, 0, 0, 0.1)',
        'sticky': '0 8px 24px -6px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
