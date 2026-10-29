/** @type {import('tailwindcss').Config} */

// Brand channels from globals.css — supports opacity modifiers (bg-accent/20)
const channel = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Stage-independent brand colours
        ink: channel('ink'),
        paper: channel('paper'),
        brand: {
          DEFAULT: channel('accent'),
          soft: channel('accent-soft'),
          deep: channel('accent-deep'),
        },
        // Stage-aware role tokens (change as you scroll between stages)
        fg: {
          DEFAULT: 'var(--fg)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
        },
        hairline: 'var(--hairline)',
        surface: 'var(--surface)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        dot: ['var(--font-dot)', 'ui-monospace', 'monospace'],
        // Authority Juice redesign numerals (loaded on /work/authority-juice only)
        'aj-tight': ['var(--font-aj-tight)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
