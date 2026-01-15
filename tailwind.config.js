// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
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
        dark: 'oklch(0.1 0 264)',
        foreground: 'oklch(0.23 0 264)',
        light: 'oklch(0.3 0 264)',
        hover: 'oklch(0.35 0 264)',
        focus: 'oklch(0.4 0 264)',
        border: 'oklch(0.30 0 20)',
        default: 'oklch(0.96 0 20)',
        muted: 'oklch(0.76 0 20)',
        danger: 'oklch(0.65 0.20 25)',
        success: 'oklch(0.65 0.16 145)',
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
