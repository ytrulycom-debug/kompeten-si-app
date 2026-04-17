import Link from 'next/link'
import { notFound } from 'next/navigation'
import MarkdownContent from '@/components/MarkdownContent'

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

const PROGRAM_BENEFITS = [
  'Une leçon courte chaque matin pendant 7 jours',
  'Des exemples concrets et faciles à appliquer',
  'Un rythme léger pour progresser sans te perdre',
]

const JOUR_EMOJIS = ['🌱', '📖', '💡', '🛠️', '🔗', '🚀', '🏆']

export const dynamic = 'force-dynamic'

async function getData(): Promise<ApiData | null> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) return null
  try {
    const res = await fetch(webhookUrl, { cache: 'no-store' })
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
  if (isNaN(rang) || rang < 1 || rang > 5) notFound()

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
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:underline"
      >
        ← Retour au classement
      </Link>

      <section className="relative overflow-hidden rounded-[2rem] bg-brand-green p-5 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,166,35,0.35),_transparent_30%),radial-gradient(circle_at_left,_rgba(255,255,255,0.12),_transparent_28%)]" />
        <div className="relative">
          <p className="inline-flex rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-50">
            Micro-formation #{rang} · {data.semaine}
          </p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight">
            {item.competence}
          </h2>
          <p className="mt-2 text-sm leading-6 text-green-100">
            {item.nb_offres} offre{item.nb_offres > 1 ? 's' : ''} cette semaine.
            Tu peux commencer ici avec un aperçu gratuit du Jour 1, puis recevoir
            la suite sur Telegram.
          </p>
          <div className="mt-5 grid gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur-sm sm:grid-cols-3">
            {PROGRAM_BENEFITS.map((benefit) => (
              <p key={benefit} className="text-sm leading-6 text-green-50">
                {benefit}
              </p>
            ))}
          </div>
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 text-sm font-bold text-brand-dark transition hover:brightness-95"
          >
            Démarrer sur Telegram
          </a>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <span className="text-lg">{JOUR_EMOJIS[0]}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Jour 1 / 7</p>
              <p className="text-xs text-gray-500">Aperçu gratuit</p>
            </div>
          </div>
          <div className="relative pt-4">
            <MarkdownContent text={teaserLines} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent" />
          </div>
          <div className="pt-4 text-center">
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-brand-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-800"
            >
              Lire la suite + recevoir les 7 jours
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Ce que tu vas recevoir
          </p>
          <div className="mt-4 space-y-3">
            {PROGRAM_BENEFITS.map((benefit, index) => (
              <div
                key={benefit}
                className="flex gap-3 rounded-2xl bg-white/80 p-3 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-brand-dark px-4 py-3 text-sm text-slate-200">
            Tu reçois une progression guidée, pas un gros bloc difficile à suivre.
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
              Programme complet
            </p>
            <h3 className="mt-1 text-xl font-bold text-brand-dark">
              Les 7 jours du parcours
            </h3>
          </div>
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-green">
            Déblocage via Telegram
          </span>
        </div>
        <div className="mt-4 grid gap-2">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <span className="text-lg">{JOUR_EMOJIS[idx]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-700">
                  Jour {idx + 1} / 7
                </p>
                <p className="text-xs text-gray-500">
                  Débloqué automatiquement après ton inscription.
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-500">
                🔒 Verrouillé
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-brand-dark p-5 text-center text-white shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
          Passage à l'action
        </p>
        <p className="mt-2 text-2xl font-bold">Reçois la suite sur Telegram</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Appuie sur le bouton, puis sur <strong className="text-white">Start</strong>{' '}
          dans Telegram. Ton parcours démarre automatiquement.
        </p>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-2xl bg-amber-400 px-6 py-3 text-sm font-bold text-brand-dark transition hover:brightness-95"
        >
          Démarrer ma formation gratuitement
        </a>
        <p className="mt-3 text-xs text-slate-400">
          Une nouvelle leçon arrive chaque matin à 8h.
        </p>
      </section>

      <div className="text-center">
        <Link
          href="/ma-formation"
          className="text-sm font-medium text-brand-green hover:underline"
        >
          Tu es déjà inscrit ? → Voir ta leçon du jour
        </Link>
      </div>

      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-center">
        <p className="text-sm font-medium text-yellow-800">
          💪 7 jours pour transformer ta carrière !
        </p>
        <p className="mt-1 text-xs text-yellow-600">
          Consacre 30 minutes par jour à cette formation pour maîtriser{' '}
          {item.competence}.
        </p>
      </div>

      <Link
        href="/"
        className="block text-center text-sm text-brand-green hover:underline"
      >
        ← Voir les autres compétences de la semaine
      </Link>
    </div>
  )
}
