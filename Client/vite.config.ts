import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@map': path.resolve(__dirname,"./public/mapTiled"),
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Autres configurations...
  server: {
    port: 4173, // Spécifiez le port par défaut ici
  },

});
