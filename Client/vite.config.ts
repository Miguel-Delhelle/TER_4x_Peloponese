import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@map': path.resolve(__dirname,"./public/mapTiled"),
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Autres configurations...
  server: {
    port: 5000, // Spécifiez le port par défaut ici
  },

});
