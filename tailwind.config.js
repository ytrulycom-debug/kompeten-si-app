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
        apple: {
          bg:        '#F5F5F7',
          text:      '#1D1D1F',
          secondary: '#6E6E73',
          tertiary:  '#AEAEB2',
          separator: '#E5E5EA',
        },
      },
      boxShadow: {
        card:    '0 2px 12px rgba(0,0,0,0.06)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
