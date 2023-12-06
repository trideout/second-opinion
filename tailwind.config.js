const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./resources/**/*.blade.php", "./resources/**/*.tsx"],
    theme: {
        fontFamily: {
            sans: ["Inter", ...defaultTheme.fontFamily.sans],
        },
        extend: {
            colors: {
                primary: {
                    50: "#f5fbf4",
                    100: "#def6d9",
                    200: "#bde8b5",
                    300: "#a6de9b",
                    400: "#7ec16a",
                    500: "#5faa41",
                    600: "#3c7d4d",
                    700: "#325343",
                    800: "#1e3e2e",
                    900: "#0f2a1a",
                    1000: "#051608",
                },
                gray: colors.zinc,
                beige: {
                    50: "#fffcf6",
                    100: "#f7f0e6",
                    200: "#f7f0eb",
                    300: "#eedacd",
                },
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
        require("@tailwindcss/container-queries"),
    ],
};
