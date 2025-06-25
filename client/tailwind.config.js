/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#f8f9fa',
          300: '#f1f3f4',
          400: '#e8eaed',
          500: '#dadce0',
          600: '#9aa0a6',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        },
        secondary: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#f8f9fa',
          300: '#f1f3f4',
          400: '#e8eaed',
          500: '#dadce0',
          600: '#9aa0a6',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        },
        accent: {
          50: '#fef7f7',
          100: '#fdf2f2',
          200: '#fce4e4',
          300: '#fbd5d5',
          400: '#f8b4b4',
          500: '#f87171',
          600: '#ef4444',
          700: '#dc2626',
          800: '#b91c1c',
          900: '#991b1b',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #ffffff 0%, #fdfdfd 50%, #f8f9fa 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
      }
    },
  },
  plugins: [],
} 