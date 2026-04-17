import type { Metadata, Viewport } from 'next'
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
}

export const viewport: Viewport = {
  themeColor: '#15803d',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-brand-light text-brand-dark">
        <header className="relative overflow-hidden bg-brand-green px-4 py-5 text-white shadow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,166,35,0.28),_transparent_26%),linear-gradient(120deg,_rgba(255,255,255,0.08),_transparent_45%)]" />
          <div className="relative mx-auto flex max-w-2xl items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-2xl shadow-sm backdrop-blur-sm">
              🎯
            </span>
            <div>
              <h1 className="text-xl font-bold leading-tight">KompetenSI</h1>
              <p className="text-xs text-green-100">
                Radar des compétences · Afrique de l&apos;Ouest
              </p>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-6">
          {children}
        </main>
        <footer className="px-4 py-8 text-center text-xs text-gray-500">
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/60 bg-white/60 px-4 py-4 shadow-sm backdrop-blur">
            Propulsé par KompetenSI 🇧🇫 · Données mises à jour chaque lundi
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
