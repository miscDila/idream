/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        'grid-blue': '#E3F2FD', // Light blue for grid paper
        'grid-line': '#90CAF9', // Light blue grid lines
      },
      backgroundImage: {
        'grid-paper': 'linear-gradient(to right, #E3F2FD 1px, transparent 1px), linear-gradient(to bottom, #E3F2FD 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px', // Grid cell size
      },
    },
  },
  plugins: [],
}

