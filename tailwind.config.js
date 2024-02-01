/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.html", "./src/**/*.jsx", "./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primaryLight: "#d9d9d9",
        primaryLightOpacity: "rgba(255,255,255,0.4)",
        secondaryLight: "#ffffff",
        accentLight: "#f2f2f2",

        primaryDark: "#1f2229",
        primaryDarkOpacity: "rgba(32,33,36,0.75)",
        secondaryDark: "#202124",
        accentDark: "#303134",

        items: "#5fd9f9",
        itemsHover: "#2ac0e5d4",
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
