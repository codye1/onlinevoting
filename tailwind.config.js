// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      ...defaultTheme.screens,
      md: '745px',
      sm: '560px',
      xs: '500px',
    },
    extend: {
      fontFamily: {
        sans: ['Oswald', 'sans-serif'],
      },
      boxShadow: {
          s: 'inset 0 1px 2px #ffffff30, 0 1px 2px #00000030, 0 2px 4px #00000015',
          m: 'inset 0 1px 2px #ffffff50, 0 2px 4px #00000030, 0 4px 8px #00000015',
      },
      textShadow: {
        s: '0 0 4px',
        m: '0 0 6px',
      },
      colors: {
        dark: 'oklch(var(--c-dark) / <alpha-value>)',
        foreground: 'oklch(var(--c-foreground) / <alpha-value>)',
        light: 'oklch(var(--c-light) / <alpha-value>)',
        hover: 'oklch(var(--c-hover) / <alpha-value>)',
        focus: 'oklch(var(--c-focus) / <alpha-value>)',
        border: 'oklch(var(--c-border) / <alpha-value>)',
        default: 'oklch(var(--c-default) / <alpha-value>)',
        muted: 'oklch(var(--c-muted) / <alpha-value>)',
        danger: 'oklch(var(--c-danger) / <alpha-value>)',
        success: 'oklch(var(--c-success) / <alpha-value>)',
      },
    },

  },
  plugins: [
    function({ addUtilities, theme }) {
      const values = theme('textShadow');
      const utilities = Object.entries(values).map(([key, value]) => ({
        [`.text-shadow-${key}`]: { textShadow: value },
      }));
      addUtilities(utilities);
    },
  ],
};
