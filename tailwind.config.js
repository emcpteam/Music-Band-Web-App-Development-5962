/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        pastel: {
          pink: '#FFE1E6',
          blue: '#E1F0FF',
          purple: '#F0E1FF',
          green: '#E1FFE6',
          yellow: '#FFF9E1',
          orange: '#FFE8E1',
        },
        primary: {
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
        }
      },
      backgroundImage: {
        'gradient-pastel': 'linear-gradient(135deg, #FFE1E6 0%, #E1F0FF 25%, #F0E1FF 50%, #E1FFE6 75%, #FFF9E1 100%)',
        'gradient-soft': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }
    },
  },
  plugins: [],
}