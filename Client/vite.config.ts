import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'common': path.resolve(__dirname, '../Common/src'),
    },
  },
});