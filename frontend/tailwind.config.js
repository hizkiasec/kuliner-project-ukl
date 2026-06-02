/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          400: '#fbbf24',
          500: '#f5a623',
          600: '#e8872a',
          700: '#c2620a',
        },
        dark: {
          900: '#0a0a0f',
          800: '#13131a',
          700: '#1c1c27',
          600: '#252535',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f5a623, #e8872a)',
        'dark-gradient': 'linear-gradient(135deg, #13131a, #1c1c27)',
      },
    },
  },
  plugins: [],
};
