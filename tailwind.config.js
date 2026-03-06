/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./*.html", "./collections/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        "primary": "#D67D7D",
        "primary-hover": "#C46868",
        "accent-gold": "#B8962F",
        "accent-gold-dark": "#9A7D25",
        "accent-teal": "#2F8F86",
        "accent-teal-dark": "#1F6B66",
        "divider": "#B48CB8",
        "lavender": "#C8A2C8",
        "lavender-soft": "#EDE3F1",
        "background-cream": "#FAF8F3",
        "text-main": "#1A1414",
        "text-secondary": "#5A5454",
        "border-light": "#DDD8CF",
      },
      fontFamily: {
        "display": ["Lato", "sans-serif"],
        "serif": ["Playfair Display", "serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}

