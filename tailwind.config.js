/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: "#ccc", // Custom border color
      },
      backgroundColor: {
        'background': '#f5f5f5', // Add a custom background color
      },
      textColor: {
        'foreground': '#333333', // Define custom text color
      },
    },
  },
  plugins: [],
};
