import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  root: ".", // ✅ ルートを明示
  publicDir: "public",
  build: {
    outDir: "dist", // ✅ 出力先を指定
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ パスエイリアスを明示（たまに必要）
    },
  },
})