'use client'

import { useState } from 'react'

const JOUR_EMOJIS = ['🌱', '📖', '💡', '🛠️', '🔗', '🚀', '🏆']

interface Props {
  jours: string[]
}

export default function JoursAccordion({ jours }: Props) {
  const [ouvert, setOuvert] = useState(0)

  return (
    <div className="flex flex-col gap-2">
      {jours.map((jourTexte, idx) => {
        const estOuvert = ouvert === idx
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* En-tête cliquable */}
            <button
              onClick={() => setOuvert(estOuvert ? -1 : idx)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{JOUR_EMOJIS[idx] || '📌'}</span>
                <span className="font-semibold text-sm text-gray-800">
                  Jour {idx + 1} / 7
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                {estOuvert ? '▲' : '▼'}
              </span>
            </button>

            {/* Contenu dépliable */}
            {estOuvert && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  {jourTexte}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
