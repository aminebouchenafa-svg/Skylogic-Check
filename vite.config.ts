import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // L'application est publiée sur GitHub Pages dans un sous-dossier
  // (https://<compte>.github.io/Skylogic-Check/) : toutes les ressources
  // doivent être référencées à partir de ce préfixe.
  base: '/Skylogic-Check/',
})
