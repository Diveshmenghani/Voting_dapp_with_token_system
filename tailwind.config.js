module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: 'hsl(224, 71%, 4%)',
          foreground: 'hsl(213, 31%, 91%)',
          primary: 'hsl(210, 40%, 98%)',
          secondary: 'hsl(222.2, 47.4%, 11.2%)',
          accent: 'hsl(216, 34%, 17%)',
        },
      },
    },
    plugins: [],
  }