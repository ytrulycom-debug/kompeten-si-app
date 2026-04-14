'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

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

  // Lecture directe depuis window.location (plus fiable que useSearchParams dans les WebViews)
  // Supporte ?cid= (nouveau, sans underscore) et ?chat_id= (rétrocompatibilité)
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
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-brand-green font-medium mb-5 hover:underline"
      >
        ← Retour au classement
      </Link>

      {/* Chargement initial */}
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Chargement de ta formation...</p>
        </div>
      )}

      {/* Formulaire — affiché seulement si pas de cid dans l'URL et pas encore de données */}
      {!loading && !data && !chatIdFromUrl && (
        <>
          <div className="bg-brand-green text-white rounded-xl p-5 mb-6">
            <p className="text-xs text-green-200 uppercase tracking-wide font-medium">Suivi personnel</p>
            <h2 className="text-xl font-bold mt-1">Ma formation du jour</h2>
            <p className="text-sm text-green-200 mt-1">
              Entre ton identifiant pour accéder à ta leçon du jour.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ton identifiant
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="ex: 123456789"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green mb-3"
            />
            <p className="text-xs text-gray-400 mb-4">
              Ton identifiant se trouve dans le message reçu sur Telegram à l'inscription.
            </p>
            <button
              type="submit"
              disabled={loading || !chatId.trim()}
              className="w-full bg-brand-green text-white font-bold py-3 rounded-xl text-sm hover:bg-green-800 transition disabled:opacity-50"
            >
              Voir ma formation du jour
            </button>
          </form>
        </>
      )}

      {/* Erreur */}
      {erreur && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-700">{erreur}</p>
          <a
            href="https://t.me/Kompetensi12bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm font-semibold text-brand-green hover:underline"
          >
            → S'inscrire sur Telegram
          </a>
        </div>
      )}

      {/* Résultat */}
      {data && (
        <div>
          {/* En-tête */}
          <div className="bg-brand-green text-white rounded-xl p-5 mb-4">
            <p className="text-xs text-green-200 uppercase tracking-wide font-medium">
              {data.semaine}
            </p>
            <h2 className="text-xl font-bold mt-1">{data.competence}</h2>
            <p className="text-sm text-green-200 mt-1">
              {data.nb_offres} offre{data.nb_offres > 1 ? 's' : ''} cette semaine
            </p>

            {/* Barre de progression */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-bold bg-white text-brand-green px-3 py-1 rounded-full">
                Jour {data.jour_actuel} / 7
              </span>
              <div className="flex-1 bg-green-900 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${(data.jour_actuel / 7) * 100}%` }}
                />
              </div>
              <span className="text-xs text-green-200">
                {data.jour_actuel === 7 ? '✅' : `${7 - data.jour_actuel}j restants`}
              </span>
            </div>

            {/* Pastilles jours */}
            <div className="flex gap-1.5 mt-3">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${
                    i < data.jour_actuel ? 'bg-white' : 'bg-green-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Contenu du jour */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
              <span className="text-lg">{JOUR_EMOJIS[data.jour_actuel - 1] || '📌'}</span>
              <span className="font-semibold text-sm text-gray-800">
                Jour {data.jour_actuel} — Leçon du jour
              </span>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                {data.contenu_du_jour}
              </p>
            </div>
          </div>

          {/* Message de progression */}
          {data.jour_actuel < 7 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center mb-4">
              <p className="text-sm font-semibold text-yellow-800">
                ✨ Reviens demain pour le Jour {data.jour_actuel + 1}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Tu recevras un lien sur Telegram à 8h chaque matin.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-center mb-4">
              <p className="text-lg font-bold text-brand-green">🎉 Formation terminée !</p>
              <p className="text-sm text-green-700 mt-1">
                Tu maîtrises maintenant les bases de {data.competence}.
              </p>
            </div>
          )}

          {/* Changer d'identifiant */}
          <button
            onClick={() => { setData(null); setChatId(''); setChatIdFromUrl('') }}
            className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-2"
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
