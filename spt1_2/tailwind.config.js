// tailwind.config.js
module.exports = {
  mode: 'jit', // Ajoutez cette ligne pour activer le mode JIT
  purge: ['./components/**/*.{vue,js}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}'],
  // ... autres configurations ...
};

