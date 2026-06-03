// tailwind.config.js (minimal version)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        fadeInUp: "fadeInUp 0.4s ease-out",
        slideInRight: "slideInRight 0.3s ease-out",
        zoomIn: "zoomIn 0.2s ease-out",
        spin: "spin 0.8s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite",
        glowAmber: "glowAmber 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        zoomIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 0px rgba(239, 68, 68, 0.4)" },
          "50%": { boxShadow: "0 0 8px 4px rgba(239, 68, 68, 0.8)" },
        },
        glowAmber: {
          "0%, 100%": { boxShadow: "0 0 0px rgba(245, 158, 11, 0.4)" },
          "50%": { boxShadow: "0 0 10px 5px rgba(245, 158, 11, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};