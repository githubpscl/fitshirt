/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a2332',
          50: '#f4f5f7',
          100: '#e8eaee',
          200: '#c8cdd6',
          300: '#a7b0bd',
          400: '#65718a',
          500: '#2f3d56',
          600: '#1a2332',
          700: '#161e2b',
          800: '#101622',
          900: '#0a0e16',
        },
        accent: {
          DEFAULT: '#e8dcc8',
          50: '#fbf8f3',
          100: '#f6efe2',
          200: '#eee0c5',
          300: '#e8dcc8',
          400: '#d4c0a0',
          500: '#b89a72',
          600: '#917656',
        },
        cream: '#faf8f3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
