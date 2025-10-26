/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        // màu chữ
        primary: '#2B7516',
        secondary: '#082503',

        // Màu background
        'main-bg': '#FFFFFF',
        'soft-bg': '#515A3C',
        // màu này là màu xanh lá ở account
        'dark-bg': '#344F1F',
        // màu xanh lá đậm ở landing page
        'hightlight': '#C2A68C',
      },

      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        lora: ["lora"],
        serif_text: ["DM Serif Text"],
        inter: ["Inter", "sans-serif"]
      },

    },
  },
  plugins: [],
};