/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        lightblack: "#1E2023",
        whitetext: "#FAFAFA",
        lavender: "#9e9199",
        softGrey: "#d0d1d3",
      },
    },
  },
  plugins: [],
};
