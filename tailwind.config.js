/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005cbb',
          dark: '#0453ad',
        },
        sensitive: '#ccddf0',
        'text-muted': '#696e72',
        employee: {
          DEFAULT: '#218802',
          soft: 'rgba(33, 136, 2, 0.12)',
        },
        request: {
          DEFAULT: '#b30068',
          soft: 'rgba(179, 0, 104, 0.1)',
        },
        surface: '#ffffff',
        background: 'whitesmoke',
      },
      borderRadius: {
        'xs': '3px',
        'sm': '5px',
        'md': '10px',
      },
      boxShadow: {
        'card': '0px 2px 20px rgba(2, 4, 5, 0.18)',
      }
    },
  },
  plugins: [],
}
