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
          black: 'rgb(var(--liver-black-rgb, 10 10 12) / <alpha-value>)',
          dark: 'rgb(var(--liver-dark-rgb, 20 20 23) / <alpha-value>)',
          panel: 'rgb(var(--liver-panel-rgb, 28 28 33) / <alpha-value>)',
          red: 'rgb(var(--liver-red-rgb, 220 38 38) / <alpha-value>)',
          redHover: 'rgb(var(--liver-red-hover-rgb, 185 28 28) / <alpha-value>)',
          redLight: 'rgb(var(--liver-red-light-rgb, 254 242 242) / <alpha-value>)',
          redBorder: 'rgb(var(--liver-red-border-rgb, 254 202 202) / <alpha-value>)',
        }
      }
    },
  },
  plugins: [],
}
