/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#e10600',
          dark: '#05070b',
          card: '#10151f',
          accent: '#e1060025',
        }
      },
      fontFamily: {
        chakra: ['"Chakra Petch"', 'sans-serif'],
        cairo: ['Cairo', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
