/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#6B2EFF',
        'brand-orange': '#FF7B1C',
        'brand-blue': '#11B3FF',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(90deg, #6B2EFF 0%, #FF7B1C 50%, #11B3FF 100%)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
