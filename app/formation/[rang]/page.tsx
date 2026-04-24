import Link from 'next/link'
import { notFound } from 'next/navigation'
import MarkdownContent from '@/components/MarkdownContent'
import FadeUp from '@/components/FadeUp'
import { StaggerGrid, StaggerItem } from '@/components/StaggerGrid'

interface Competence {
  rang: number
  competence: string
  nb_offres: number
  micro_formation: string
  jours: string[]
}

interface ApiData {
  semaine: string
  competences: Competence[]
  error?: string
}

const JOUR_EMOJIS = ['🌱', '📖', '💡', '🛠️', '🔗', '🚀', '🏆']

export const revalidate = 3600

async function getData(): Promise<ApiData | null> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) return null
  try {
    const res = await fetch(webhookUrl, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function FormationPage({
  params,
}: {
  params: { rang: string }
}) {
  const rang = parseInt(params.rang)
  if (isNaN(rang) || rang < 1 || rang > 10) notFound()

  const data = await getData()
  if (!data || !data.competences?.length) notFound()

  const item = data.competences.find((c) => c.rang === rang)
  if (!item) notFound()

  const jour1 = item.jours?.[0] ?? item.micro_formation ?? ''
  const teaserLines = jour1
    .split('\n')
    .filter((line: string) => line.trim())
    .slice(0, 5)
    .join('\n')
  const telegramLink = `https://t.me/Kompetensi12bot?start=${rang}`

  return (
    <div className="space-y-5">

      <FadeUp delay={0.05}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-apple-secondary transition hover:text-apple-text"
        >
          ← Retour
        </Link>
      </FadeUp>

      {/* Hero */}
      <FadeUp delay={0.2}>
      <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-green px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-white">
            #{rang}
          </span>
          <span className="text-base font-semibold uppercase tracking-wider text-apple-tertiary">
            {data.semaine}
          </span>
        </div>

        <h1 className="mt-4 text-[28px] font-black leading-tight tracking-tight text-apple-text sm:text-[34px]">
          {item.competence}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-base font-semibold text-brand-green">
            📈 {item.nb_offres} offre{item.nb_offres > 1 ? 's' : ''} cette semaine
          </span>
          <span className="rounded-full bg-apple-bg px-4 py-2 text-base text-apple-secondary">
            7 jours de formation
          </span>
          <span className="rounded-full bg-apple-bg px-4 py-2 text-base text-apple-secondary">
            Gratuit sur Telegram
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-2xl bg-brand-green px-7 py-5 text-lg font-bold text-white shadow-md transition hover:bg-brand-green-dark"
          >
            Démarrer sur Telegram →
          </a>
          <Link
            href="/ma-formation"
            className="flex items-center justify-center rounded-2xl bg-apple-bg px-7 py-5 text-lg font-semibold text-apple-text transition hover:bg-gray-200/70"
          >
            Déjà inscrit ? Voir ma leçon
          </Link>
        </div>
      </section>
      </FadeUp>

      {/* Teaser day 1 */}
      <FadeUp delay={0.35}>
      <section className="rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-center gap-3 border-b border-apple-separator/50 pb-4">
          <span className="text-xl">{JOUR_EMOJIS[0]}</span>
          <div>
            <p className="text-base font-bold text-apple-text">Jour 1 / 7 — Aperçu gratuit</p>
            <p className="text-sm text-apple-secondary">Prends une idée du contenu avant de démarrer</p>
          </div>
        </div>
        <div className="relative mt-4">
          <MarkdownContent text={teaserLines} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>
        <div className="pt-4 text-center">
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-brand-green hover:underline"
          >
            Lire la suite et recevoir les 7 jours →
          </a>
        </div>
      </section>
      </FadeUp>

      {/* 7 days */}
      <FadeUp delay={0.1}>
      <section className="rounded-3xl bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-widest text-apple-tertiary">Programme</p>
        <h3 className="mt-2 text-2xl font-bold text-apple-text">Les 7 jours du parcours</h3>
        <StaggerGrid className="mt-4 space-y-2">
          <StaggerItem>
            <div className="flex items-center gap-3 rounded-2xl bg-apple-bg p-4">
              <span className="text-xl">{JOUR_EMOJIS[0]}</span>
              <p className="flex-1 text-base font-semibold text-apple-text">Jour 1 / 7</p>
              <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-bold text-white">
                Gratuit
              </span>
            </div>
          </StaggerItem>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <StaggerItem key={idx}>
              <div className="flex items-center gap-3 rounded-2xl bg-apple-bg p-4 opacity-55">
                <span className="text-xl">{JOUR_EMOJIS[idx]}</span>
                <p className="flex-1 text-base font-semibold text-apple-text">Jour {idx + 1} / 7</p>
                <span className="text-sm text-apple-tertiary">🔒 Via Telegram</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
      </FadeUp>

      {/* Final CTA */}
      <FadeUp delay={0.1}>
      <section className="rounded-3xl bg-brand-green p-6 text-center text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-300">
          Passage à l&apos;action
        </p>
        <h3 className="mt-3 text-2xl font-black tracking-tight">
          Reçois tes 7 leçons sur Telegram
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-lg leading-relaxed text-green-100">
          Appuie sur le bouton, puis sur{' '}
          <strong className="text-white">Start</strong> dans Telegram.
          Ton parcours démarre automatiquement. Une leçon par matin.
        </p>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-5 text-lg font-bold text-brand-green shadow-md transition hover:bg-green-50"
        >
          Démarrer gratuitement →
        </a>
        <p className="mt-3 text-base text-green-200">Aucun compte nécessaire · Gratuit</p>
      </section>
      </FadeUp>

      <FadeUp delay={0.1}>
        <Link
          href="/"
          className="block text-center text-sm text-apple-secondary transition hover:text-apple-text"
        >
          ← Voir toutes les compétences de la semaine
        </Link>
      </FadeUp>

    </div>
  )
}
