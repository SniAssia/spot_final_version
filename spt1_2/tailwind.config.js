module.exports = {
  mode: 'jit', // JIT mode enables on-demand compilation of Tailwind classes
  purge: ['./components/**/*.{vue,js}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}'],
  darkMode: false, // or 'media' or 'class' if you need dark mode support
  theme: {
    extend: {
      colors: {
        'blue-sea-light': '#6EC1E4',   // Light blue sea color
        'blue-sea': '#2A8D99',         // Default blue sea color
        'blue-sea-dark': '#1F6B7B',    // Darker blue sea color
        'blue-sea-darker': '#155C66',  // Even darker blue sea color
      },
    },
  },
  variants: {
    extend: {
      // Extend variants for responsiveness, states (hover, focus, etc.)
    },
  },
  plugins: [],
}
