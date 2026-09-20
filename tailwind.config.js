/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        },
        maroon: {
          50: '#fdf2f4',
          100: '#fbe6ea',
          500: '#9f1239',
          600: '#881337',
          700: '#6b0f2b',
          800: '#4c0a1e',
          900: '#330613'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        display: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}
