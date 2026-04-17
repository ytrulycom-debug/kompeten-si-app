import Link from 'next/link'

const RANG_CONFIG = [
  {
    badge: 'bg-amber-400 text-white',
    card: 'border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-100/80 shadow-amber-100',
    shadow: 'shadow-lg',
    accent: 'text-amber-700',
  },
  {
    badge: 'bg-orange-400 text-white',
    card: 'border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-100/80 shadow-orange-100',
    shadow: 'shadow-md',
    accent: 'text-orange-700',
  },
  {
    badge: 'bg-emerald-500 text-white',
    card: 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 shadow-emerald-100',
    shadow: 'shadow-md',
    accent: 'text-emerald-700',
  },
  {
    badge: 'bg-blue-400 text-white',
    card: 'border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-100/80 shadow-blue-100',
    shadow: 'shadow-sm',
    accent: 'text-blue-700',
  },
  {
    badge: 'bg-fuchsia-500 text-white',
    card: 'border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 via-white to-fuchsia-100/80 shadow-fuchsia-100',
    shadow: 'shadow-sm',
    accent: 'text-fuchsia-700',
  },
]

const HOW_IT_WORKS = [
  {
    title: 'Repere la compétence la plus porteuse',
    description:
      'Chaque semaine, KompetenSI sélectionne les 5 compétences qui reviennent le plus dans les offres.',
  },
  {
    title: 'Choisis ton parcours en 1 clic',
    description:
      'Tu ouvres la compétence qui t\'intéresse et tu démarres gratuitement depuis Telegram.',
  },
  {
    title: 'Apprends un peu chaque matin',
    description:
      'Pendant 7 jours, tu reçois une micro-leçon claire, concrète et pensée pour progresser vite.',
  },
]

interface Competence {
  rang: number
  competence: string
  nb_offres: number
  micro_formation: string
  jours: string[]
}

interface ApiData {
  semaine: string
  date_analyse: string
  competences: Competence[]
  total: number
  error?: string
}

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

export default async function HomePage() {
  const data = await getData()

  if (!data || data.error || !data.competences?.length) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-5xl">⏳</div>
        <h2 className="text-lg font-semibold text-gray-700">
          Données en cours de chargement
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Le radar se met à jour chaque lundi matin.
          <br />
          Reviens bientôt !
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-brand-green px-5 py-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,166,35,0.35),_transparent_30%),radial-gradient(circle_at_left,_rgba(255,255,255,0.12),_transparent_28%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-green-50">
            📅 {data.semaine || 'Cette semaine'}
          </span>
          <h2 className="mt-4 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">
            Les compétences qui ouvrent le plus d'opportunités cette semaine
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
            KompetenSI transforme les tendances du marché en parcours simples de 7
            jours pour t'aider à choisir une compétence utile et passer à l'action.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-green-50">
            <span className="rounded-full bg-white/12 px-3 py-1">Burkina Faso</span>
            <span className="rounded-full bg-white/12 px-3 py-1">
              7 jours de micro-formation
            </span>
            <span className="rounded-full bg-white/12 px-3 py-1">
              Telegram chaque matin
            </span>
          </div>
          <div className="mt-6 grid gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur-sm sm:grid-cols-3">
            <div>
              <p className="text-2xl font-black">{data.total}</p>
              <p className="text-xs text-green-100">
                compétences classées cette semaine
              </p>
            </div>
            <div>
              <p className="text-2xl font-black">7</p>
              <p className="text-xs text-green-100">jours pour prendre de l'élan</p>
            </div>
            <div>
              <p className="text-2xl font-black">1</p>
              <p className="text-xs text-green-100">
                choix simple pour commencer aujourd'hui
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-brand-green/10 bg-white/80 p-5 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
              Comment ça marche
            </p>
            <h3 className="mt-2 text-xl font-bold text-brand-dark">
              Choisis une compétence, puis laisse le parcours te guider
            </h3>
          </div>
          <div className="rounded-2xl bg-brand-light px-3 py-2 text-xs font-semibold text-brand-green">
            Gratuit
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-brand-light/60 p-4"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                {idx + 1}
              </div>
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
              Classement hebdomadaire
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-brand-dark">
              Top 5 compétences demandées
            </h3>
          </div>
          <p className="max-w-52 text-right text-xs leading-5 text-gray-500">
            Ouvre une compétence pour voir un aperçu du Jour 1 et démarrer sur
            Telegram.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {data.competences.map((item, idx) => {
            const config = RANG_CONFIG[idx]
            const isFirst = idx === 0

            return (
              <Link
                key={item.rang}
                href={`/formation/${item.rang}`}
                className={`group block rounded-[1.6rem] border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${config.card} ${config.shadow} ${isFirst ? 'sm:p-5' : ''}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold ${config.badge} ${isFirst ? 'text-lg' : 'text-sm'}`}
                    >
                      {item.rang}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`font-bold leading-snug text-gray-800 ${isFirst ? 'text-lg' : 'text-base'}`}
                        >
                          {item.competence}
                        </p>
                        {isFirst && (
                          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                            Plus forte traction
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.nb_offres} offre{item.nb_offres > 1 ? 's' : ''}{' '}
                        repérée{item.nb_offres > 1 ? 's' : ''} cette semaine
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`block text-xs font-semibold ${config.accent}`}>
                      Voir l'aperçu
                    </span>
                    <span className="mt-1 block text-2xl text-gray-300 transition-transform group-hover:translate-x-1">
                      ›
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                    Jour 1 gratuit
                  </span>
                  <span className="rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                    7 leçons courtes
                  </span>
                  <span className="rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                    Envoi sur Telegram
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            Pourquoi Telegram
          </p>
          <h3 className="mt-2 text-xl font-bold text-brand-dark">
            Tu continues ta formation là où tu es déjà actif
          </h3>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Pas besoin de créer un compte compliqué. Tu choisis une compétence ici,
            puis tu reçois chaque matin une leçon facile à lire, directement sur
            Telegram.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">
              Leçons courtes
            </span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">
              Adapté mobile
            </span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">
              Rythme quotidien
            </span>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-brand-dark p-5 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Prochaine étape
          </p>
          <h3 className="mt-2 text-xl font-bold">
            Ouvre une compétence et démarre aujourd'hui
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Le meilleur point d'entrée est souvent la compétence classée n°1. Mais
            l'important, c'est de choisir un parcours et de commencer.
          </p>
          <Link
            href="/formation/1"
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 text-sm font-bold text-brand-dark transition hover:brightness-95"
          >
            Voir la compétence n°1
          </Link>
        </div>
      </section>

      <div className="rounded-3xl border border-dashed border-brand-green/20 bg-white/60 px-5 py-4 text-center">
        <p className="text-sm font-semibold text-gray-800">
          Tu n'as pas besoin de tout apprendre d'un coup.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Choisis une compétence utile, commence par le Jour 1, puis avance un peu
          chaque matin.
        </p>
      </div>
    </div>
  )
}
