import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // L'application est servie à la racine du domaine (Cloudflare Pages).
  base: '/',
})
