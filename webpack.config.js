import path from 'path'; 
import { fileURLToPath } from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);


export default {
  entry: './src/Client/main.ts',                 // Point d'entrée de ton application
  output: {
    filename: 'bundle.js',               // Le fichier final généré
    path: path.resolve(__dirname, 'dist/Client'), // Le répertoire de sortie
  },
  resolve: {
    extensions: ['.ts', '.js'],           // Extensions à résoudre
  },
  module: {
    rules: [
      {
        test: /\.ts$/,                    // Traiter les fichiers .ts
        use: 'ts-loader',                  // Utiliser ts-loader pour compiler TypeScript
        exclude: /node_modules/,           // Exclure le répertoire node_modules
      },
    ],
  },
  devtool:'source-map',
  mode: 'development',                    // Mode développement
};