import Link from 'next/link'

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
      <div className="py-20 text-center">
        <div className="mb-4 text-5xl">⏳</div>
        <h2 className="text-lg font-semibold text-gray-700">Données en cours de chargement</h2>
        <p className="mt-2 text-sm text-gray-500">
          Le radar se met à jour chaque lundi matin.
          <br />
          Reviens bientôt !
        </p>
      </div>
    )
  }

  const hero = data.competences[0]
  const others = data.competences.slice(1)

  return (
    <div className="space-y-10">

      {/* Week badge */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-green shadow-sm">
          📅 {data.semaine || 'Cette semaine'}
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Les compétences les plus<br className="hidden sm:block" /> demandées cette semaine
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          KompetenSI transforme les tendances du marché en parcours simples de 7 jours pour passer à l'action.
        </p>
      </div>

      {/* Hero card — #1 compétence */}
      <Link
        href={`/formation/${hero.rang}`}
        className="group block rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-xl shadow-gray-200/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/80 sm:p-8"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          🏆 Plus forte traction
        </span>

        <h3 className="mt-5 text-2xl font-extrabold leading-snug tracking-tight text-gray-900 sm:text-3xl">
          {hero.competence}
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-800">
            📈 {hero.nb_offres} offre{hero.nb_offres > 1 ? 's' : ''} cette semaine
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
            📘 Jour 1 gratuit
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
            ⏱️ 7 leçons courtes
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
            📨 Envoi sur Telegram
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="rounded-xl bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-sm transition group-hover:bg-green-800">
            Commencer le parcours →
          </span>
        </div>
      </Link>

      {/* Other skills grid */}
      {others.length > 0 && (
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Autres compétences porteuses
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((item) => (
              <Link
                key={item.rang}
                href={`/formation/${item.rang}`}
                className="group flex flex-col rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green/20 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      #{item.rang}
                    </p>
                    <p className="mt-1.5 text-base font-bold leading-snug text-gray-900">
                      {item.competence}
                    </p>
                    <p className="mt-1 text-sm font-medium text-brand-green">
                      {item.nb_offres} offre{item.nb_offres > 1 ? 's' : ''} repérée{item.nb_offres > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 text-xs text-gray-400">
                    <span className="rounded-full bg-gray-50 px-2.5 py-1">📘 Jour 1 gratuit</span>
                    <span className="rounded-full bg-gray-50 px-2.5 py-1">7 leçons</span>
                  </div>
                  <span className="shrink-0 rounded-xl bg-brand-green px-3.5 py-1.5 text-xs font-bold text-white transition group-hover:bg-green-800">
                    Voir →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why Telegram */}
      <section className="rounded-[1.75rem] border border-brand-green/10 bg-green-50/60 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-green">Pourquoi Telegram</p>
        <h3 className="mt-2 text-xl font-bold text-gray-900">
          Tu continues ta formation là où tu es déjà actif
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
          Pas besoin de créer un compte compliqué. Tu choisis une compétence ici, puis tu reçois chaque matin une leçon directement sur Telegram.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {['📖 Leçons courtes', '📱 Adapté mobile', '⏰ Rythme quotidien', '🆓 Gratuit'].map((f) => (
            <span key={f} className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm">
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <div className="rounded-[1.5rem] border border-dashed border-brand-green/20 bg-white/70 px-5 py-6 text-center">
        <p className="text-sm font-semibold text-gray-800">
          Tu n'as pas besoin de tout apprendre d'un coup.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Choisis une compétence utile, commence par le Jour 1, puis avance un peu chaque matin.
        </p>
        <Link
          href="/formation/1"
          className="mt-4 inline-flex items-center justify-center rounded-2xl border border-brand-green/30 px-6 py-2.5 text-sm font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          Voir la compétence n°1
        </Link>
      </div>

    </div>
  )
}
