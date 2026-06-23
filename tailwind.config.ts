import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: "#ff77cc",
        "pink-deep": "#d63aa0",
        ice: "#d9ffff",
        "ice-deep": "#7fe3ff",
        lilac: "#c8a2ff",
        cream: "#fff7fc",
        ink: "#2b1733",
      },
      fontFamily: {
        sans: ["Galmuri11", "Apple SD Gothic Neo", "sans-serif"],
        pixel: ["Galmuri9", "Galmuri11", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
