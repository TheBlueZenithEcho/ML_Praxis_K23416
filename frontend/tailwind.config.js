/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "node_modules/preline/dist/*.js"
    ],
    prefix: "",
    theme: {
        extend: {
            colors: {
                primary: '#2B7516',
                secondary: '#082503',
            },

            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                    lg: '4rem',
                    xl: '5rem',
                    '2xl': '6rem',
                }
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                lora: ["lora"],
                serif_text: ["DM Serif Text"],
                inter: ["Inter", "sans-serif"]
            },
            screens: {
                sm: '640px',
                md: '760px',
                lg: '960px',
                xl: '1200px'
            },
            backgroundImage: {
                'hero': "url('/src/assets/img/hero/bg.png')",
            },
        },
    },
    plugins: [],
};