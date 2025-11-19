/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-dull': 'rgb(var(--color-primary-dull) / <alpha-value>)',
        light: 'rgb(var(--color-light) / <alpha-value>)',
        borderColor: 'rgb(var(--color-border-color) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}