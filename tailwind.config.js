/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        'weather-primary': '#1E213A',
        'weather-secondary': '#100E1D',
      },
      fontFamily: {
        'Nunito': ['Nunito', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '2rem',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
      },
    },
  },
  plugins: [],
}

