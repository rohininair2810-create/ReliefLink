/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-primary': '#172D40',
        'navy-secondary': '#24465C',
        'teal': '#197C78',
        'amber': '#E5A04B',
        'emergency-red': '#D94B45',
        'bg-base': '#F4F6F8',
        'card': '#FFFFFF',
        'text-main': '#263238',
        'text-secondary': '#718096',
      },
      fontFamily: {
        'heading': ['Manrope', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
