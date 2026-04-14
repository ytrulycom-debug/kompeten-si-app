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
  const teaserLines = jour1.split('\n').filter((l: string) => l.trim()).slice(0, 5).join('\n')

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

      {/* Jour 1 — teaser avec dégradé */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-2 overflow-hidden">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-100">
          <span className="text-lg">{JOUR_EMOJIS[0]}</span>
          <span className="font-semibold text-sm text-gray-800">Jour 1 / 7</span>
          <span className="ml-auto text-xs bg-green-100 text-brand-green font-medium px-2 py-0.5 rounded-full">
            Aperçu gratuit
          </span>
        </div>
        <div className="relative px-4 pt-3 pb-0">
          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
            {teaserLines}
          </p>
          <div className="h-8 bg-gradient-to-t from-white to-transparent -mt-2" />
        </div>
        <div className="px-4 pb-4 pt-2 text-center">
          <a
            href={`https://t.me/Kompetensi12bot?start=${rang}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-green text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-green-800 transition"
          >
            Lire la suite + recevoir les 7 jours →
          </a>
        </div>
      </div>

      {/* Jours 2-7 — verrouillés */}
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <div
          key={idx}
          className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-2 opacity-70"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{JOUR_EMOJIS[idx]}</span>
            <span className="font-semibold text-sm text-gray-500">
              Jour {idx + 1} / 7
            </span>
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
          Inscris-toi gratuitement et reçois une nouvelle leçon chaque matin à 8h.
        </p>
        <a
          href={`https://t.me/Kompetensi12bot?start=${rang}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-brand-green font-bold px-6 py-3 rounded-xl text-sm hover:bg-green-50 transition"
        >
          Démarrer ma formation gratuitement →
        </a>
        <p className="text-xs text-green-300 mt-3">
          Appuie sur Start dans Telegram — l'inscription démarre automatiquement.
        </p>
      </div>

      {/* Lien pour inscrits */}
      <div className="mt-4 text-center">
        <Link
          href="/ma-formation"
          className="text-sm text-brand-green hover:underline font-medium"
        >
          Tu es déjà inscrit ? → Voir ta leçon du jour
        </Link>
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
