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
      fontFamily: { sans: ['var(--font-geist)', 'Inter', 'system-ui', 'sans-serif'] },
      colors: { brand: { 600: '#2563eb', 700: '#1d4ed8' } },
      typography: (theme) => ({
        DEFAULT: { css: { maxWidth: 'none', color: theme('colors.slate.700'), a: { color: theme('colors.blue.600') } } },
        invert: { css: { color: theme('colors.slate.300'), a: { color: theme('colors.blue.400') } } },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
