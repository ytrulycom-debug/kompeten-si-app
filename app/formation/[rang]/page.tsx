import Link from 'next/link'
import { notFound } from 'next/navigation'

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

export const revalidate = 604800

const JOUR_EMOJIS = ['🌱', '📖', '💡', '🛠️', '🔗', '🚀', '🏆']

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

  return (
    <div>
      {/* Retour */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-brand-green font-medium mb-5 hover:underline"
      >
        ← Retour au classement
      </Link>

      {/* En-tête */}
      <div className="bg-brand-green text-white rounded-xl p-5 mb-6">
        <p className="text-xs text-green-200 uppercase tracking-wide font-medium">
          Micro-formation #{rang} · {data.semaine}
        </p>
        <h2 className="text-xl font-bold mt-1">{item.competence}</h2>
        <p className="text-sm text-green-200 mt-1">
          {item.nb_offres} offre{item.nb_offres > 1 ? 's' : ''} cette semaine · Programme de 7 jours
        </p>
      </div>

      {/* Jours de formation */}
      {item.jours.length > 0 ? (
        <div className="flex flex-col gap-4">
          {item.jours.map((jourTexte, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{JOUR_EMOJIS[idx] || '📌'}</span>
                <div>
                  <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                    {jourTexte}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
            {item.micro_formation}
          </p>
        </div>
      )}

      {/* CTA Telegram */}
      <div className="mt-8 bg-brand-green text-white rounded-xl p-5 text-center">
        <p className="text-lg font-bold mb-1">📲 Recevoir cette formation sur Telegram</p>
        <p className="text-sm text-green-200 mb-4">
          Inscris-toi gratuitement et reçois le bon contenu chaque matin pendant 7 jours.
        </p>
        <a
          href={`https://t.me/Kompetensi12bot`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-brand-green font-bold px-6 py-3 rounded-xl text-sm hover:bg-green-50 transition"
        >
          Envoie &laquo;&nbsp;{rang}&nbsp;&raquo; sur le bot → Démarrer
        </a>
        <p className="text-xs text-green-300 mt-3">
          Une fois sur Telegram, envoie simplement le chiffre <strong>{rang}</strong> pour démarrer.
        </p>
      </div>

      {/* Footer motivation */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
        <p className="text-sm font-medium text-yellow-800">
          💪 7 jours pour transformer ta carrière !
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          Consacre 30 minutes par jour à cette formation pour maîtriser {item.competence}.
        </p>
      </div>

      <Link
        href="/"
        className="block mt-6 text-center text-sm text-brand-green hover:underline"
      >
        ← Voir les autres compétences de la semaine
      </Link>
    </div>
  )
}
