'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import MarkdownContent from '@/components/MarkdownContent'

interface ParcoursData {
  jour_actuel: number
  rang: number
  competence: string
  contenu_du_jour: string
  nb_offres: number
  semaine: string
}

const JOUR_EMOJIS = ['🌱', '📖', '💡', '🛠️', '🔗', '🚀', '🏆']

const ENTRY_STEPS = [
  'Ouvre le lien recu sur Telegram, ou colle ton identifiant ci-dessous.',
  'KompetenSI retrouve ton parcours et le jour en cours automatiquement.',
  'Lis ta lecon du jour puis reviens demain pour la suivante.',
]

function MaFormationContent() {
  const [chatId, setChatId] = useState('')
  const [chatIdFromUrl, setChatIdFromUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ParcoursData | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)

  const chargerFormation = useCallback(async (id: string) => {
    if (!id.trim()) return
    setLoading(true)
    setErreur(null)
    setData(null)

    try {
      const res = await fetch(`/api/mon-parcours?chat_id=${encodeURIComponent(id.trim())}`)
      const json = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          setErreur("Aucun compte trouvé. Inscris-toi d'abord sur Telegram.")
        } else {
          setErreur('Une erreur est survenue. Réessaie dans quelques instants.')
        }
      } else {
        setData(json)
      }
    } catch {
      setErreur('Impossible de contacter le serveur. Vérifie ta connexion.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('cid') ?? params.get('chat_id') ?? ''
    if (id) {
      setChatId(id)
      setChatIdFromUrl(id)
      chargerFormation(id)
    }
  }, [chargerFormation])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    chargerFormation(chatId)
  }

  return (
    <div className="space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:underline"
      >
        ← Retour au classement
      </Link>

      {!data && (
        <section className="relative overflow-hidden rounded-[2rem] bg-brand-green p-5 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,166,35,0.35),_transparent_30%),radial-gradient(circle_at_left,_rgba(255,255,255,0.12),_transparent_28%)]" />
          <div className="relative">
            <p className="inline-flex rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-50">
              Suivi personnel
            </p>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight">
              Retrouve ta leçon du jour en quelques secondes
            </h2>
            <p className="mt-3 text-sm leading-6 text-green-100">
              Si tu es déjà inscrit sur Telegram, entre ton identifiant pour reprendre
              exactement là où tu en es dans ta formation.
            </p>
            <div className="mt-5 grid gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur-sm sm:grid-cols-3">
              {ENTRY_STEPS.map((step, index) => (
                <div key={step} className="rounded-2xl bg-white/8 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-50">
                    Étape {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-green-50">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {loading && !data && (
        <div className="rounded-[1.75rem] border border-brand-green/10 bg-white/80 py-16 text-center shadow-sm backdrop-blur">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-green border-t-transparent" />
          <p className="text-sm font-semibold text-gray-700">
            Chargement de ta formation...
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Nous retrouvons ton parcours et ta leçon du jour.
          </p>
        </div>
      )}

      {!loading && !data && !chatIdFromUrl && (
        <section className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
              Acces a ma formation
            </p>
            <h3 className="mt-2 text-xl font-bold text-brand-dark">
              Entre ton identifiant Telegram
            </h3>
            <label className="mt-5 block text-sm font-semibold text-gray-700">
              Ton identifiant
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="ex: 123456789"
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <p className="mt-3 text-xs leading-5 text-gray-500">
              Ton identifiant se trouve dans le message reçu sur Telegram au moment
              de l'inscription.
            </p>
            <button
              type="submit"
              disabled={loading || !chatId.trim()}
              className="mt-5 w-full rounded-2xl bg-brand-green py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:opacity-50"
            >
              Voir ma formation du jour
            </button>
          </form>

          <div className="rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Besoin d'aide
            </p>
            <h3 className="mt-2 text-xl font-bold text-brand-dark">
              Tu n'as pas encore ton identifiant ?
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Lance d'abord ton parcours sur Telegram. Tu recevras ensuite le lien
              ou l'identifiant qui permet de retrouver automatiquement ta leçon.
            </p>
            <a
              href="https://t.me/Kompetensi12bot"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-2xl bg-brand-dark px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
            >
              Ouvrir le bot Telegram
            </a>
            <div className="mt-4 rounded-2xl bg-white/80 p-4 text-sm text-gray-600 shadow-sm">
              Astuce: si tu ouvres ce lien depuis Telegram, l'identifiant peut être
              transmis automatiquement dans l'URL.
            </div>
          </div>
        </section>
      )}

      {erreur && (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">{erreur}</p>
          <a
            href="https://t.me/Kompetensi12bot"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-brand-green hover:underline"
          >
            → S&apos;inscrire sur Telegram
          </a>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <section className="relative overflow-hidden rounded-[2rem] bg-brand-green p-5 text-white shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,166,35,0.35),_transparent_30%),radial-gradient(circle_at_left,_rgba(255,255,255,0.12),_transparent_28%)]" />
            <div className="relative">
              <p className="inline-flex rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-50">
                {data.semaine}
              </p>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight">
                {data.competence}
              </h2>
              <p className="mt-2 text-sm leading-6 text-green-100">
                {data.nb_offres} offre{data.nb_offres > 1 ? 's' : ''} cette semaine.
                Tu es actuellement au Jour {data.jour_actuel} sur 7.
              </p>

              <div className="mt-5 rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-brand-green">
                    Jour {data.jour_actuel} / 7
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-green-900">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${(data.jour_actuel / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-green-100">
                    {data.jour_actuel === 7 ? 'Terminé' : `${7 - data.jour_actuel} jours restants`}
                  </span>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < data.jour_actuel ? 'bg-white' : 'bg-green-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-[1.12fr_0.88fr]">
            <div className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <span className="text-lg">{JOUR_EMOJIS[data.jour_actuel - 1] || '📌'}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Jour {data.jour_actuel} — Leçon du jour
                  </p>
                  <p className="text-xs text-gray-500">
                    Prends ton temps et avance à ton rythme.
                  </p>
                </div>
              </div>
              <div className="p-5">
                <MarkdownContent text={data.contenu_du_jour} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.75rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Rythme conseillé
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-gray-800">1. Lis la leçon</p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Consacre 20 à 30 minutes à lire calmement le contenu du jour.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-gray-800">2. Applique une idée</p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Essaie au moins un exercice, une action ou une réflexion concrète.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-gray-800">3. Reviens demain</p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      La progression est pensée pour t'aider à avancer pas à pas.
                    </p>
                  </div>
                </div>
              </div>

              {data.jour_actuel < 7 ? (
                <div className="rounded-[1.75rem] border border-yellow-200 bg-yellow-50 p-5 text-center shadow-sm">
                  <p className="text-sm font-semibold text-yellow-800">
                    Reviens demain pour le Jour {data.jour_actuel + 1}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-yellow-700">
                    Tu recevras un rappel ou un lien sur Telegram à 8h chaque matin.
                  </p>
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-green-300 bg-green-50 p-5 text-center shadow-sm">
                  <p className="text-lg font-bold text-brand-green">
                    🎉 Formation terminée !
                  </p>
                  <p className="mt-2 text-sm leading-6 text-green-700">
                    Tu as parcouru les 7 jours de {data.competence}. Bravo pour ta constance.
                  </p>
                </div>
              )}
            </div>
          </section>

          <button
            onClick={() => {
              setData(null)
              setChatId('')
              setChatIdFromUrl('')
              setErreur(null)
            }}
            className="block w-full text-center text-xs text-gray-400 transition hover:text-gray-600"
          >
            Utiliser un autre identifiant
          </button>
        </div>
      )}
    </div>
  )
}

export default function MaFormationPage() {
  return <MaFormationContent />
}
