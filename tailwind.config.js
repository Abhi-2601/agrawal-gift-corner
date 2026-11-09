/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        ivory: "#FAF7F2",
        "warm-white": "#FFFDF9",
        plum: "#392633",
        "muted-rose": "#AE737D",
        "soft-blush": "#F1E5E5",
        "champagne-gold": "#C2A16D",
        ink: "#30272B",
        "secondary-text": "#6E6266",
        "subtle-border": "#E8DED7",
        // Storefront homepage palette (sampled from the approved reference design)
        burgundy: {
          DEFAULT: "#80111F",
          light: "#971724",
          dark: "#5A0A14",
          deep: "#450509",
        },
        cream: "#FCF8F5",
        blush: {
          DEFAULT: "#FBE3DE",
          deep: "#F3CFC8",
        },
        star: "#E5A12B",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Manrope"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        body: ['"Manrope"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        brand: ['"Cinzel"', '"Trajan Pro"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', '"Brush Script MT"', 'cursive'],
      },
      keyframes: {
        heroIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "hero-in": "heroIn 0.45s ease-out both",
      },
    },
  },
  plugins: [],
};
