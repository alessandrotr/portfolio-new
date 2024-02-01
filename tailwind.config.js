/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.html", "./src/**/*.jsx", "./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primaryDark: "#1f2229",
        secondaryDark: "#283541",

        items: "#5fd9f9",
        itemsHover: "#2ac0e5",
      },
      backgroundColor: (theme) => theme("colors"),
      textColor: (theme) => theme("colors"),
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
    },
  },
  plugins: [],
};
