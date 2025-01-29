import path from 'path'; 
import { fileURLToPath } from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);


export default {
  entry: path.resolve(__dirname,'src','Client','main.ts'),                 // Point d'entrée de ton application
 
  module: {
    rules: [
      {
        test: /\.ts$/,                    // Traiter les fichiers .ts
        use: 'ts-loader',                  // Utiliser ts-loader pour compiler TypeScript
        exclude: /node_modules/,           // Exclure le répertoire node_modules
      },
    ],
  },

  resolve: {
    extensions: ['.tsx','.ts','.js'],           // Extensions à résoudre
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'socket.io-client': path.resolve(__dirname, 'node_modules/socket.io-client')},
  },

  output: {
    filename: 'bundle.js',               // Le fichier final généré
    path: path.resolve(__dirname, 'dist', 'Client'), // Le répertoire de sortie
    libraryTarget: 'module', // Utiliser les modules ES6
  },
  experiments: {
    outputModule: true, // Activer les modules ES6 dans la sortie
  },

  devServer: {
    static: './dist/Server/server.js'
  },

  devtool:'source-map',
  target: 'web',
  mode: 'development',                    // Mode développement
};