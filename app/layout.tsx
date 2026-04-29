import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'KompetenSI — Radar des compétences en Afrique',
  description: "Les 10 compétences les plus demandées cette semaine en Afrique de l'Ouest, avec une micro-formation de 7 jours.",
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KompetenSI',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#F5F5F7',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-apple-bg text-apple-text">
        <header className="sticky top-0 z-50 border-b border-apple-separator/60 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green text-base font-black text-white leading-none">
                K
              </span>
              <span className="text-[17px] font-bold tracking-tight text-apple-text">
                KompetenSI
              </span>
            </Link>
            <Link
              href="/ma-formation"
              className="rounded-xl bg-apple-bg px-4 py-2 text-base font-semibold text-brand-green transition hover:bg-gray-200/70"
            >
              Ma formation
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-5 py-4">
          {children}
        </main>
        <footer className="pb-10 pt-4 text-center">
          <p className="text-xs text-apple-tertiary">
            KompetenSI · Données mises à jour chaque lundi · Burkina Faso 🇧🇫
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
