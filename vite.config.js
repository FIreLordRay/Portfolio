import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths: the build works at https://firelordray.github.io/ and locally alike.
  base: './',
  plugins: [react(), tailwindcss()],
  server: { port: 5174, strictPort: true }, // embertype's dev server has 5173
  test: { environment: 'node' },
})
