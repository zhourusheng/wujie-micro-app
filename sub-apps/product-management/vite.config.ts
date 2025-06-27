import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8002, // 商品管理子应用的开发端口
    cors: true,
    origin: 'http://localhost:8002',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/product/' : '/',
  // 防止依赖被打包，避免加载冗余资源
  build: {
    minify: 'terser',
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        // 静态资源分类打包
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
        manualChunks: {
          react: ['react', 'react-dom'],
          antd: ['antd'],
        },
      },
    },
  },
}); 