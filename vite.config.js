import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = import.meta.dirname;

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true
  },
  plugins: [
    react(),
    {
      name: 'trailing-slash-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ? req.url.split('?')[0] : '';
          const paths = ['/mario', '/minecraft', '/odyssey', '/kart', '/scratch'];
          if (paths.includes(url)) {
            res.writeHead(301, { Location: url + '/' });
            return res.end();
          }
          next();
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        scratch: resolve(rootDir, 'scratch/index.html'),
        odyssey: resolve(rootDir, 'odyssey/index.html'),
        kart: resolve(rootDir, 'kart/index.html'),
        mario: resolve(rootDir, 'mario/index.html'),
        minecraft: resolve(rootDir, 'minecraft/index.html')
      }
    }
  }
});
