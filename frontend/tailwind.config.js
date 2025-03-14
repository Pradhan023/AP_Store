/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addVariant, addUtilities }) {
      // Add autofill variant
      addVariant('autofill', '&:-webkit-autofill');
      
      // Add custom utilities for autofill
      addUtilities({
        '.autofill-bg': {
          '-webkit-box-shadow': '0 0 0 1000px #374151 inset !important',
          'box-shadow': '0 0 0 1000px #374151 inset !important',
        },
        '.autofill-text': {
          '-webkit-text-fill-color': '#fff !important',
        }
      });
    }
  ],
}

