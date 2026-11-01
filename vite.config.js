import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/rkccleaners/',
  plugins: [tailwindcss()],
  build: {
    rolldownOptions: {
      input: ['index.html', 'reviews/index.html'],
    },
  },
});
