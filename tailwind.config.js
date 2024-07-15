/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/viewInventory/*.{html,js,css,jsx}",
    "./src/components/product/*.{html,js,css,jsx}",
    "./src/pages/ProductDetail/*.{html,js,css,jsx} ",
    "./src/components/Footer/*.{html,js,css,jsx}" ,
    "./src/manager/**/*.{html,js,css,jsx}" , 
 
  ],  
  theme: {
    extend: {
      translate: {
        '-5': '-5px',
      },
    },
  },
  variants: {
    extend: {
      translate: ['group-hover'], // Optional: Extend with group-hover variant if needed
    },
  },
  plugins: [],
}
