/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                balima: {
                    950: '#020617', // Ultra Dark (Footer)
                    900: '#0B1120', // PRIMARY BRAND: Midnight Blue (Sidebar)
                    800: '#1e293b', // Secondary Blue
                    100: '#f1f5f9', // Background Platinum
                    gold: '#C5A059', // LUXURY ACCENT
                    goldDim: '#A88645', // Hover Gold
                }
            }
        },
    },
    plugins: [],
}