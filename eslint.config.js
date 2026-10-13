const browser = Object.fromEntries('window document location navigator console matchMedia IntersectionObserver ResizeObserver requestAnimationFrame cancelAnimationFrame performance devicePixelRatio innerWidth innerHeight addEventListener FormData setTimeout clearTimeout getComputedStyle'.split(' ').map(k => [k, 'readonly']));
export default [{ files: ['src/**/*.js'], languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: browser },
  rules: { 'no-unused-vars': 'error', 'no-undef': 'error', 'prefer-const': 'warn' } }];
