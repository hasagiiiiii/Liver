/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        liver: {
          black: 'var(--liver-black)',
          dark: 'var(--liver-dark)',
          panel: 'var(--liver-panel)',
          red: 'var(--liver-red)',
          redHover: 'var(--liver-red-hover)',
          redLight: 'var(--liver-red-light)',
          redBorder: 'var(--liver-red-border)',
        }
      }
    },
  },
  plugins: [],
}
