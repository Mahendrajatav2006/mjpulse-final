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
        background: "#07070B",
        surface: "#0F0F17",
        "surface-card": "rgba(22, 22, 35, 0.7)",
        primary: {
          DEFAULT: "#8B5CF6",
          glow: "#A78BFA",
          dark: "#6D28D9",
        },
        cyan: {
          neon: "#00F0FF",
        },
        pink: {
          neon: "#FF007F",
        },
        emerald: {
          neon: "#10B981",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-orbitron)", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 25px rgba(139, 92, 246, 0.35)",
        "neon-cyan": "0 0 25px rgba(0, 240, 255, 0.35)",
        "neon-pink": "0 0 25px rgba(255, 0, 127, 0.35)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "wave": "wave 1.2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        wave: {
          "0%, 100%": { height: "6px" },
          "50%": { height: "24px" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
