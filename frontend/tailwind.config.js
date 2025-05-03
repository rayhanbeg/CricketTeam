module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eefbfd",
          100: "#d4f3f9",
          200: "#ade6f3",
          300: "#75d3e9",
          400: "#37b9d9",
          500: "#1e9fc0",
          600: "#1a80a2",
          700: "#1c6784",
          800: "#1e556d",
          900: "#1e485d",
          950: "#0f2e3e",
        },
        secondary: {
          50: "#f0fdf6",
          100: "#dcfce9",
          200: "#bbf7d6",
          300: "#86efb9",
          400: "#4ade94",
          500: "#22c572",
          600: "#16a35a",
          700: "#15824a",
          800: "#16673e",
          900: "#145536",
          950: "#052e1b",
        },
        accent: {
          50: "#fff9ec",
          100: "#fff0d3",
          200: "#ffdfa5",
          300: "#ffc86d",
          400: "#ffa732",
          500: "#ff8c0a",
          600: "#ff6b00",
          700: "#cc4d02",
          800: "#a13c0b",
          900: "#82330d",
          950: "#461805",
        },
        dark: {
          100: "#1e1e2a",
          200: "#191925",
          300: "#15151f",
          400: "#12121a",
          500: "#0e0e15",
          600: "#0a0a10",
          700: "#07070a",
          800: "#030305",
          900: "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232d2d3a' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        "spin-slow": "spin 3s linear infinite",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [], // Removed @tailwindcss/forms plugin
}
