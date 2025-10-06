import { defineConfig } from 'vite';

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern'
            }
        },
        devSourcemap: true
    },
    build: {
        minify: 'terser',
        terserOptions: {
            compress: true,
            mangle: true
        },
        target: 'es2015'
    }
});