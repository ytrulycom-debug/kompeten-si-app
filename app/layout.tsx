import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'KompetenSI — Radar des compétences en Afrique',
  description: 'Les 5 compétences les plus demandées cette semaine en Afrique de l\'Ouest, avec une micro-formation de 7 jours.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KompetenSI',
  },
  formatDetection: { telephone: false },
  themeColor: '#15803d',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-brand-light">
        <header className="bg-brand-green text-white py-4 px-4 shadow">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h1 className="text-xl font-bold leading-tight">KompetenSI</h1>
              <p className="text-xs text-green-200">Radar des compétences · Afrique de l&apos;Ouest</p>
            </div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="text-center text-xs text-gray-400 py-6">
          Propulsé par KompetenSI 🇧🇫 · Données mises à jour chaque lundi
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
