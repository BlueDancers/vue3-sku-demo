/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    margin: {
      0: '0px',
      5: '5px',
      10: '10px',
      20: '20px',
      30: '30px',
      40: '40px',
      50: '50px',
    },
    extend: {},
  },
  plugins: [],
  important: '#body',
  corePlugins: {
    preflight: false,
  },
}
