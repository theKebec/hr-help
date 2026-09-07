import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const target = 'https://api.deepseek.com'

// 开发环境代理：/api/deepseek/* -> https://api.deepseek.com/*
const deepseekProxy = {
  target,
  changeOrigin: true,
  secure: true,
  rewrite: (path) => path.replace(/^\/api\/deepseek/, '')
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.DEPLOY_RUN_PORT) || 7100,
    strictPort: true,
    hmr: {
      port: Number(process.env.DEPLOY_RUN_PORT) || 7100,
      path: '/hot/vite-hmr'
    },
    proxy: {
      '/api/deepseek': deepseekProxy
    }
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.DEPLOY_RUN_PORT) || 7100,
    strictPort: true,
    proxy: {
      '/api/deepseek': deepseekProxy
    }
  }
})
