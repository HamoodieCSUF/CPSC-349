/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'card-red': '#dc2626',
        'card-black': '#1f2937',
        'goldfish-orange': '#f97316',
        'goldfish-dark': '#c2410c',
        'goldfish-light': '#fdba74',
        'ocean-blue': '#0c4a6e',
        'ocean-dark': '#082f49',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 1s infinite',
      }
    },
  },
  plugins: [],
}
