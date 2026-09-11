import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /**
     * L'application s'installe sur l'appareil et fonctionne sans réseau.
     *
     * Tout ce dont elle a besoin — code, styles, polices, icônes — est mis en
     * cache à la première visite ; les visites suivantes ne demandent rien au
     * réseau. Une nouvelle version se met en place toute seule au lancement
     * suivant.
     */
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png', 'emblem.png'],
      manifest: {
        name: 'Skylogic Check — Fleet Training',
        short_name: 'Skylogic Check',
        description: 'Notation en vol et au simulateur, export PDF et transmission.',
        lang: 'fr',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'any',
        background_color: '#070c16',
        theme_color: '#070c16',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        // Le moteur PDF et les polices pèsent : on les met en cache malgré tout.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,png,woff2,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  // Publiée sur GitHub Pages dans un sous-dossier
  // (https://<compte>.github.io/Skylogic-Check/) : toutes les ressources
  // doivent être référencées à partir de ce préfixe.
  base: '/Skylogic-Check/',
})
