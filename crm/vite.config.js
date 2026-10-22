import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: { input: {
        index: 'index.html',
        atividade: 'atividade-sa.html',
        exemplo: 'exemplo-usuario.html',
      }, },
  },
  test: { environment: 'jsdom', include: ['src/**/*.test.js'] },
});
