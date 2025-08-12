/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  exclude: ['node_modules', 'dist'],
  safelist: [
    'solv-card',
    'solv-h1',
    'solv-h2', 
    'solv-h3',
    'solv-body',
    'solv-small',
    'solv-button-primary',
    'solv-button-secondary',
    'solv-input',
    'solv-status-success',
    'solv-status-warning',
    'solv-status-info',
    'solv-status-danger',
    'solv-badge',
    'solv-badge-success',
    'solv-badge-warning',
    'solv-badge-danger'
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Only Three Colors as Specified
        mint: {
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
        lavender: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        coral: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Solv Design System Colors
        solv: {
          black: '#1a1a1a',
          'gray-50': '#f9fafb',
          'gray-100': '#f3f4f6',
          'gray-200': '#e5e7eb',
          'gray-300': '#d1d5db',
          'gray-400': '#9ca3af',
          'gray-500': '#6b7280',
          'gray-600': '#4b5563',
          'gray-700': '#374151',
          'gray-800': '#1f2937',
          'gray-900': '#111827',
          blue: '#16a34a', // Now uses mint-600
          'blue-dark': '#15803d', // Now uses mint-700
          teal: '#22c55e', // Now uses mint-500
          lavender: '#a855f7', // Now uses lavender-500
          coral: '#f97316', // Now uses coral-500
        }
      },
      fontFamily: {
        'solv': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'solv-h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'solv-h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'solv-h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'solv-body': ['1rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'solv-small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
      spacing: {
        'solv-xs': '0.25rem',
        'solv-sm': '0.5rem',
        'solv-md': '1rem',
        'solv-lg': '1.5rem',
        'solv-xl': '2rem',
        'solv-2xl': '3rem',
        'solv-3xl': '4rem',
        'solv-container': '1.5rem',
      },
      borderRadius: {
        'solv': '0.5rem',
        'solv-lg': '0.75rem',
        'solv-xl': '1rem',
      },
      boxShadow: {
        'solv': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'solv-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'solv-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'hover-scale': 'hover-scale 0.2s ease-in-out',
      },
      keyframes: {
        'hover-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
