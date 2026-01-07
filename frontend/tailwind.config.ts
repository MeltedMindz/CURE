import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        // Geometric dark theme semantic colors - matching OG image
        'bg': 'var(--bg)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        'border-dark': 'var(--border)',
        'text': 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'primary-dark': 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        'primary-muted': 'var(--primary-muted)',
        'accent-dark': 'var(--accent)',
        'focus': 'var(--focus)',
        'geometric-pattern': 'var(--geometric-pattern)',
        // Updated primary to match geometric green theme
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: 'rgba(34, 197, 94, 0.15)',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
};
export default config;
