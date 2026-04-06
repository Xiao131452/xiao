import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // GitHub Pages 项目页路径（仓库名 xiao）
  base: '/xiao/',
  // 保证无论从哪个目录执行 npm run dev，都从本文件所在目录读 .env
  root: path.resolve(__dirname),
  envDir: path.resolve(__dirname),
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'model-viewer'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})