/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@company/core-ui/tailwind.preset')
  ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@company/core-ui/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}