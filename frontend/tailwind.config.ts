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
        // Dark theme semantic colors
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
        // Keep existing primary and accent for backward compatibility
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: 'rgba(142, 118, 255, 0.8)',
          500: 'rgb(142, 118, 255)',
          600: 'rgb(142, 118, 255)',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: 'rgba(142, 118, 255, 0.20)',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
