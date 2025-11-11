/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src-frontend/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50',
          hover: '#45a049',
        },
      },
    },
  },
  plugins: [],
}
