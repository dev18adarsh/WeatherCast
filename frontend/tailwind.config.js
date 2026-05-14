/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        weather: {
          night: '#0f172a',
          day: '#1e3a5f',
        },
      },
    },
  },
  plugins: [],
}
