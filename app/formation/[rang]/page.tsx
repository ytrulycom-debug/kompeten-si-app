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

const JOUR_EMOJIS = ['🌱', '📖', '💡', '🛠️', '🔗', '🚀', '🏆']

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

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-brand-green font-medium mb-5 hover:underline"
      >
        ← Retour au classement
      </Link>

      <div className="bg-brand-green text-white rounded-xl p-5 mb-6">
        <p className="text-xs text-green-200 uppercase tracking-wide font-medium">
          Micro-formation #{rang} · {data.semaine}
        </p>
        <h2 className="text-xl font-bold mt-1">{item.competence}</h2>
        <p className="text-sm text-green-200 mt-1">
          {item.nb_offres} offre{item.nb_offres > 1 ? 's' : ''} cette semaine · Programme de 7 jours
        </p>
      </div>

      {/* Jour 1 visible */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-2">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg">{JOUR_EMOJIS[0]}</span>
          <span className="font-semibold text-sm text-gray-800">Jour 1 / 7</span>
          <span className="ml-auto text-xs bg-green-100 text-brand-green font-medium px-2 py-0.5 rounded-full">
            Gratuit
          </span>
        </div>
        <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {jour1}
        </p>
      </div>

      {/* Jours 2-7 verrouillés */}
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <div
          key={idx}
          className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-2 opacity-70"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{JOUR_EMOJIS[idx]}</span>
            <span className="font-semibold text-sm text-gray-500">Jour {idx + 1} / 7</span>
            <span className="ml-auto text-lg">🔒</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Inscris-toi sur Telegram pour débloquer ce jour.
          </p>
        </div>
      ))}

      {/* CTA Telegram */}
      <div className="mt-6 bg-brand-green text-white rounded-xl p-5 text-center">
        <p className="text-lg font-bold mb-1">📲 Recevoir les 7 jours sur Telegram</p>
        <p className="text-sm text-green-200 mb-4">
          Inscris-toi gratuitement et reçois un lien chaque matin à 8h.
        </p>
        <a
          href="https://t.me/Kompetensi12bot"
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

      <div className="mt-4 text-center">
        <Link href="/ma-formation" className="text-sm text-brand-green hover:underline font-medium">
          Tu es déjà inscrit ? → Voir ta leçon du jour
        </Link>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
        <p className="text-sm font-medium text-yellow-800">💪 7 jours pour transformer ta carrière !</p>
        <p className="text-xs text-yellow-600 mt-1">
          Consacre 30 minutes par jour à cette formation pour maîtriser {item.competence}.
        </p>
      </div>

      <Link href="/" className="block mt-6 text-center text-sm text-brand-green hover:underline">
        ← Voir les autres compétences de la semaine
      </Link>
    </div>
  )
}
