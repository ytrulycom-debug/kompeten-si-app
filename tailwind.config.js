/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold:  '#F5A623',
          green: '#2D6A4F',
          dark:  '#1A1A2E',
          light: '#FFF8F0',
        },
      },
    },
  },
  plugins: [],
}
