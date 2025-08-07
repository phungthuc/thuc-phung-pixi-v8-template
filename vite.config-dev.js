import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    define: {
        DEV_MODE: true,
      },
    server: {
        port: 8080,
        watch : {
          usePolling: true,
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: '',
        minify: true,
        emptyOutDir: false,
        copyPublicDir: false,
        chunkSizeWarningLimit: 2 * 1024, // 2MB
    },
    publicDir: 'dist',
    plugins: [viteSingleFile()],
});
