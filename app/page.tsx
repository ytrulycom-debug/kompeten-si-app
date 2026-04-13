import Link from 'next/link'

const RANG_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
const RANG_COLORS = [
  'border-yellow-400 bg-yellow-50',
  'border-orange-400 bg-orange-50',
  'border-green-500 bg-green-50',
  'border-blue-400 bg-blue-50',
  'border-purple-400 bg-purple-50',
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

// Revalide la page chaque semaine (lundi)
export const revalidate = 604800

async function getData(): Promise<ApiData | null> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) return null
  try {
    const res = await fetch(webhookUrl, { next: { revalidate: 3600 } })
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
      <div className="text-center py-16">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-lg font-semibold text-gray-700">
          Données en cours de chargement
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Le radar se met à jour chaque lundi matin.
          <br />Reviens bientôt !
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* En-tête semaine */}
      <div className="mb-6 text-center">
        <p className="text-sm font-medium text-brand-green uppercase tracking-wide">
          📅 {data.semaine || 'Cette semaine'}
        </p>
        <h2 className="text-2xl font-bold text-brand-dark mt-1">
          Top 5 compétences demandées
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Clique sur une compétence pour recevoir ta micro-formation de 7 jours
        </p>
      </div>

      {/* Cartes des compétences */}
      <div className="flex flex-col gap-4">
        {data.competences.map((item, idx) => (
          <Link
            key={item.rang}
            href={`/formation/${item.rang}`}
            className={`block rounded-xl border-2 p-4 transition hover:scale-[1.02] hover:shadow-md ${RANG_COLORS[idx]}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{RANG_EMOJIS[idx]}</span>
                <div>
                  <p className="font-bold text-base text-gray-800">
                    {item.competence}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.nb_offres} offre{item.nb_offres > 1 ? 's' : ''} cette semaine
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-lg">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA Telegram */}
      <div className="mt-8 bg-brand-green text-white rounded-xl p-5 text-center">
        <p className="text-sm font-medium">
          💬 Tu peux aussi choisir ta formation directement sur Telegram
        </p>
        <p className="text-xs text-green-200 mt-1">
          Réponds avec un chiffre (1 à 5) sur notre bot pour recevoir ta formation chaque jour
        </p>
      </div>
    </div>
  )
}
