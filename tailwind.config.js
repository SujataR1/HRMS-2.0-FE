// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 0px rgba(239, 68, 68, 0.4)', // subtle red
          },
          '50%': {
            boxShadow: '0 0 8px 4px rgba(239, 68, 68, 0.8)', // strong red
          },
        },
      },
    },
  },
  plugins: [],
};
