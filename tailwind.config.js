/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#ddeef0',
          300: '#95ccd5',
          400: '#4274d9',
          500: '#293581',
          600: '#293581',
          700: '#1e2667',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.slate.700'),
            a: { color: '#4274d9' },
            'ul > li::marker': { color: '#4274d9' },
            'ol > li::marker': { color: '#4274d9', fontWeight: '700' },
          },
        },
        invert: {
          css: {
            color: theme('colors.slate.300'),
            a: { color: '#95ccd5' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
