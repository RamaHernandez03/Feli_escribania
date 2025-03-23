/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        scroll: "scroll 30s linear infinite", // Velocidad ajustada
      },
      keyframes: {
        scroll: {
          "from": { transform: "translateX(0)" },
          "to": { transform: "translateX(-50%)" }, // Se mueve exactamente la mitad del ancho
        },
      },
    },
  },
  plugins: [],
};
