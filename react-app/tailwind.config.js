/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    safelist: [
      {
        pattern: /^text-/, // so it doesn't purge the text colors
      },
    ],
  },
  theme: {
    extend: {
      fontFamily:  {
        sans: ['Roboto', 'sans-seif'],
      },
    },
  },
  plugins: [],  
}

