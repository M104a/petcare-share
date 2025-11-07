import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  root: ".", // ✅ プロジェクトルート
  build: {
    outDir: "dist", // ✅ 出力先（Vercelが読む場所）
  },
})