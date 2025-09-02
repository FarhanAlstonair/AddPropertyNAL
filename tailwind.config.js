/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B256D',
        background: '#FFFFFF',
        'background-light': '#F9FAFB',
        'text-primary': '#111827',
        'text-secondary': '#374151',
        'text-muted': '#6B7280',
      },
    },
  },
  plugins: [],
}