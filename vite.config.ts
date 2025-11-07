import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  root: ".", // ✅ プロジェクトのルートを指定
  publicDir: "public", // ✅ publicフォルダを認識させる
  build: {
    outDir: "dist", // ✅ 出力先を指定
    emptyOutDir: true, // ✅ 古いビルドを消して再生成
  },
})