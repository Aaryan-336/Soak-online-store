module.exports = {
    content: [
      "./pages/**/*.{js,jsx}",
      "./components/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          'royal-green': '#0f3d13',
          'soft-cream': '#fbfaf6',
          'rust': '#b86b3a'
        },
        fontFamily: {
          serifLab: ['Playfair Display', 'serif'],
          sansLab: ['Inter', 'sans-serif']
        }
      }
    },
    plugins: []
  }
  