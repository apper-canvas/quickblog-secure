/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#2D3748',
        slate: '#4A5568',
        sky: '#4299E1',
        surface: '#FFFFFF',
        background: '#F7FAFC',
        success: '#48BB78',
        warning: '#ED8936',
        error: '#E53E3E',
        info: '#3182CE'
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif']
      },
      gridTemplateColumns: {
        'sidebar': '280px 1fr',
        'editor': '1fr 320px'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}