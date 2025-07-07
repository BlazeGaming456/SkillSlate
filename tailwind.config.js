/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1c1c1c",
        accent: "#00f5a0",
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      scrollBehavior: ['responsive'],
    },
  },
  variants: {
    extend: {
      scrollBehavior: ['responsive'],
    },
  },
  plugins: [],
};
