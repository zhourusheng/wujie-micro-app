import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8001,
    cors: true,
    origin: 'http://localhost:8001',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  base: '/',
  // 配置生产环境打包输出目录
  build: {
    outDir: 'dist',
  },
}); 