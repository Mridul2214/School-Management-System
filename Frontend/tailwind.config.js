/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    DEFAULT: '#2563eb',
                    hover: '#1d4ed8',
                },
                secondary: '#7C3AED', // Purple-600
                success: '#10B981', // Green-500
                warning: '#F59E0B', // Amber-500
                danger: '#EF4444', // Red-500
                dark: '#111827', // Gray-900
                light: '#F9FAFB', // Gray-50
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
