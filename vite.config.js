import { defineConfig } from 'vite'

export default defineConfig({
  base: '/caminho-da-quaresma/', // mantém para GitHub Pages

  publicDir: 'public',

  server: {
    port: 3000,
    open: '/'
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})