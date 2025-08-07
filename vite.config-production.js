import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    define: {
        DEV_MODE: false,
        __VITE_PRELOAD__: '[]',
        global: 'globalThis',
    },
    build: {
        outDir: 'dist',
        assetsDir: '',
        minify: 'terser',
        emptyOutDir: false,
        copyPublicDir: false,
        chunkSizeWarningLimit: 2 * 1024, // 2MB
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
                manualChunks: undefined,
            }
        }
    },
    publicDir: 'dist',
    plugins: [viteSingleFile()],
    optimizeDeps: {
        exclude: ['vite-plugin-singlefile']
    },
    ssr: {
        noExternal: ['vite-plugin-singlefile']
    }
});
