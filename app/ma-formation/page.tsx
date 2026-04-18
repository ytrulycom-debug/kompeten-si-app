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
        className="inline-flex items-center gap-1.5 text-sm font-medium text-apple-secondary transition hover:text-apple-text"
      >
        ← Retour
      </Link>

      {/* Intro header */}
      {!data && !loading && (
        <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-apple-tertiary">
            Suivi personnel
          </p>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-apple-text sm:text-3xl">
            Retrouve ta leçon du jour
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-apple-secondary">
            Entre ton identifiant Telegram pour reprendre exactement là où tu en es.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-apple-secondary">
            Chargement de ta formation…
          </p>
        </div>
      )}

      {/* Error */}
      {erreur && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
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

      {/* Form */}
      {!loading && !data && !chatIdFromUrl && (
        <div className="grid gap-4 sm:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-card"
          >
            <label className="block text-sm font-semibold text-apple-text">
              Ton identifiant Telegram
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="ex : 123456789"
              className="mt-3 w-full rounded-2xl border border-apple-separator bg-apple-bg px-4 py-3 text-sm text-apple-text placeholder-apple-tertiary outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
            <p className="mt-2 text-xs leading-5 text-apple-tertiary">
              Ton identifiant se trouve dans le message reçu sur Telegram à l&apos;inscription.
            </p>
            <button
              type="submit"
              disabled={loading || !chatId.trim()}
              className="mt-5 w-full rounded-2xl bg-brand-green py-3.5 text-sm font-bold text-white transition hover:bg-green-800 disabled:opacity-40"
            >
              Voir ma leçon du jour
            </button>
          </form>

          <div className="rounded-3xl bg-apple-bg p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-apple-tertiary">
              Pas encore inscrit ?
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-apple-secondary">
              Lance d&apos;abord ton parcours sur Telegram. Tu recevras ensuite le lien avec ton identifiant.
            </p>
            <a
              href="https://t.me/Kompetensi12bot"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-brand-green px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
            >
              Ouvrir le bot Telegram →
            </a>
            <p className="mt-4 text-xs text-apple-tertiary">
              Si tu ouvres depuis Telegram, l&apos;identifiant peut être transmis automatiquement dans l&apos;URL.
            </p>
          </div>
        </div>
      )}

      {/* Lesson data */}
      {data && (
        <div className="space-y-4">

          {/* Progress header */}
          <section className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-apple-tertiary">
                  {data.semaine}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-apple-text">
                  {data.competence}
                </h2>
                <p className="mt-1 text-sm text-apple-secondary">
                  {data.nb_offres} offre{data.nb_offres > 1 ? 's' : ''} cette semaine
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-brand-green px-3 py-1.5 text-sm font-bold text-white">
                Jour {data.jour_actuel} / 7
              </span>
            </div>
            <div className="mt-5">
              <div className="flex gap-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i < data.jour_actuel ? 'bg-brand-green' : 'bg-apple-separator'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-apple-tertiary">
                {data.jour_actuel === 7
                  ? 'Formation terminée ✓'
                  : `${7 - data.jour_actuel} jour${7 - data.jour_actuel > 1 ? 's' : ''} restant${7 - data.jour_actuel > 1 ? 's' : ''}`}
              </p>
            </div>
          </section>

          {/* Content + sidebar */}
          <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">

            <section className="overflow-hidden rounded-3xl bg-white shadow-card">
              <div className="flex items-center gap-3 border-b border-apple-separator/50 px-5 py-4">
                <span className="text-lg">{JOUR_EMOJIS[data.jour_actuel - 1] || '📌'}</span>
                <div>
                  <p className="text-sm font-bold text-apple-text">
                    Jour {data.jour_actuel} — Leçon du jour
                  </p>
                  <p className="text-xs text-apple-secondary">Prends ton temps.</p>
                </div>
              </div>
              <div className="p-5">
                <MarkdownContent text={data.contenu_du_jour} />
              </div>
            </section>

            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-5 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-widest text-apple-tertiary">
                  Rythme conseillé
                </p>
                <div className="mt-4 space-y-4">
                  {[
                    { n: '1', title: 'Lis la leçon', desc: '20–30 min, calmement.' },
                    { n: '2', title: 'Applique une idée', desc: 'Un exercice ou une réflexion.' },
                    { n: '3', title: 'Reviens demain', desc: 'Pas à pas.' },
                  ].map(({ n, title, desc }) => (
                    <div key={n} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-apple-bg text-xs font-bold text-apple-secondary">
                        {n}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-apple-text">{title}</p>
                        <p className="text-xs text-apple-secondary">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {data.jour_actuel < 7 ? (
                <div className="rounded-3xl bg-apple-bg p-5 text-center">
                  <p className="text-sm font-semibold text-apple-text">Reviens demain</p>
                  <p className="mt-1 text-xs text-apple-secondary">
                    Jour {data.jour_actuel + 1} t&apos;attendra à 8h sur Telegram.
                  </p>
                </div>
              ) : (
                <div className="rounded-3xl bg-brand-green p-5 text-center text-white">
                  <p className="text-lg font-black">🎉 Terminé !</p>
                  <p className="mt-1 text-sm text-green-100">7 jours complétés. Bravo.</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setData(null)
              setChatId('')
              setChatIdFromUrl('')
              setErreur(null)
            }}
            className="block w-full text-center text-xs text-apple-tertiary transition hover:text-apple-secondary"
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
