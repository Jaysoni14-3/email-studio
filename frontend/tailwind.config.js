/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b0c",
        surface: "#111113",
        border: "#1f1f23",
        muted: "#a1a1aa",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};