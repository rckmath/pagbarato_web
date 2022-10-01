module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'main-orange': '#fb5607',
        'main-yellow': '#FFC933',
        'light-pink': '#FFD6E8',
        'brighter-green': '#03B800',
        'dark-green': '#012900',
        'mid-green': '#015200',
      },
    },
  },
  plugins: [],
};
