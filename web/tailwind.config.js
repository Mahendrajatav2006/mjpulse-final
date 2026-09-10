/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080911",
        surface: "#0f111e",
        surfaceLight: "#16192b",
        neonCyan: "#00F2FE",
        neonPink: "#FF007F",
        neonPurple: "#8B5CF6",
        neonAmber: "#FFB300",
      },
    },
  },
  plugins: [],
};
