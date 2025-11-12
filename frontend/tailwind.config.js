/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  
  // SỬA: Gộp mảng 'content' cho sạch sẽ,
  // bao gồm file HTML gốc và MỌI THỨ trong /src
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  prefix: "",
  
  // GIỮ NGUYÊN: Toàn bộ theme tùy chỉnh của bạn
  theme: {
    extend: {
      colors: {
        // màu chữ
        primary: '#2B7516',
        secondary: '#082503',
        hightlight: '#FDE7B3',
        heading1 : '63A361',

        // Màu background
        'main-bg': '#FFFFFF',
        'soft-bg': '#515A3C',
        'dark-bg': '#344F1F',
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

      backgroundImage: {
                'hero': "url('/img/hero/bg.png')",
            },

    },
  },
  plugins: [],
};