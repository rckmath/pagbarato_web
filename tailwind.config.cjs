module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#367315',
        'secondary-green': '#4ea529',
        'primary-yellow': '#ef8f01',
        'secondary-yellow': '#f69f03',
        'tertiary-yellow': '#f5b705',
      },
    },
  },
  plugins: [],
}
