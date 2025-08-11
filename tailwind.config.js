/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**/*",
    "!./dist/**/*"
  ],
  theme: {
    extend: {
      colors: {
        'solv-black': '#000000',
        'solv-white': '#FFFFFF',
        'solv-teal': '#4FB3A6',
        'solv-coral': '#F29E8E',
        'solv-lavender': '#C5A3E0',
      },
      fontFamily: {
        'inter': ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        'solv-h1': ['28px', '36px'],
        'solv-h2': ['20px', '28px'],
        'solv-body': ['16px', '24px'],
        'solv-small': ['14px', '20px'],
      },
      spacing: {
        'solv-container': '24px',
        'solv-component': '16px',
        'solv-grid': '16px',
      },
      borderRadius: {
        'solv': '8px',
      },
      borderWidth: {
        'solv': '2px',
      },
      boxShadow: {
        'solv': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'solv-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
