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
        'primary-hover': 'rgb(var(--color-primary-hover) / <alpha-value>)',
        'primary-light': 'rgb(var(--color-primary-light) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
      },
      borderRadius: {
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgb(var(--color-shadow-soft) / <alpha-value>), 0 1px 2px -1px rgb(var(--color-shadow-soft) / <alpha-value>)',
        md: '0 4px 6px -1px rgb(var(--color-shadow-md) / <alpha-value>), 0 2px 4px -2px rgb(var(--color-shadow-md) / <alpha-value>)',
        lg: '0 10px 15px -3px rgb(var(--color-shadow-lg) / <alpha-value>), 0 4px 6px -4px rgb(var(--color-shadow-lg) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-lg': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h1: ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        h2: ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        h3: ['1.25rem', { lineHeight: '1.4' }],
        body: ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
      },
    },
  },
  plugins: [],
}
