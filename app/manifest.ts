import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KompetenSI — Radar des compétences',
    short_name: 'KompetenSI',
    description: 'Les 5 compétences les plus demandées au Burkina Faso cette semaine',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0fdf4',
    theme_color: '#15803d',
    icons: [
      {
        src: '/api/pwa-icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/api/pwa-icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
