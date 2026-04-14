'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ParcoursData {
  jour_actuel: number
  rang: number
  competence: string
  contenu_du_jour: string
  nb_offres: number
  semaine: string
}

export default function MaFormationPage() {
  const [chatId, setChatId] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ParcoursData | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chatId.trim()) return

    setLoading(true)
    setErreur(null)
    setData(null)

    try {
      const res = await fetch(`/api/mon-parcours?chat_id=${encodeURIComponent(chatId.trim())}`)
      const json = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          setErreur("Aucun compte trouvé pour ce chat_id. Assure-toi de t'être inscrit sur Telegram.")
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
  }

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
          Suivi personnel
        </p>
        <h2 className="text-xl font-bold mt-1">Ma formation du jour</h2>
        <p className="text-sm text-green-200 mt-1">
          Entre ton chat_id Telegram pour accéder à ta leçon du jour.
        </p>
      </div>

      {/* Formulaire */}
      {!data && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ton chat_id Telegram
          </label>
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="ex: 123456789"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green mb-3"
          />
          <p className="text-xs text-gray-400 mb-4">
            Ton chat_id t'a été envoyé dans le premier message de la formation.
          </p>
          <button
            type="submit"
            disabled={loading || !chatId.trim()}
            className="w-full bg-brand-green text-white font-bold py-3 rounded-xl text-sm hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Voir ma formation du jour'}
          </button>
        </form>
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
          <div className="bg-brand-green text-white rounded-xl p-5 mb-4">
            <p className="text-xs text-green-200 uppercase tracking-wide font-medium">
              {data.semaine}
            </p>
            <h3 className="text-lg font-bold mt-1">{data.competence}</h3>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm font-semibold bg-white text-brand-green px-3 py-1 rounded-full">
                Jour {data.jour_actuel} / 7
              </span>
              <div className="flex-1 bg-green-900 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${(data.jour_actuel / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-4">
            <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {data.contenu_du_jour}
            </p>
          </div>

          {data.jour_actuel < 7 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center mb-4">
              <p className="text-sm font-medium text-yellow-800">
                ✨ Reviens demain pour le Jour {data.jour_actuel + 1}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Tu recevras aussi ta leçon directement sur Telegram à 8h.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-center mb-4">
              <p className="text-lg font-bold text-brand-green">
                🎉 Tu as terminé ta formation !
              </p>
              <p className="text-sm text-green-700 mt-1">
                Félicitations ! Tu maîtrises maintenant les bases de {data.competence}.
              </p>
            </div>
          )}

          <button
            onClick={() => { setData(null); setChatId('') }}
            className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-2"
          >
            Utiliser un autre chat_id
          </button>
        </div>
      )}
    </div>
  )
}
