'use client'

import React from 'react'

interface Props {
  text: string
  className?: string
}

// Terms that should be auto-bolded when they appear in lesson content.
// Negative lookbehind prevents double-bolding already-marked **text**.
const HIGHLIGHT_TERMS = [
  'Jour[s]?\\s+\\d+',
  'Objectif[s]?',
  'Leçon[s]?',
  'Exemple[s]?\\s+complet[s]?',
  'Exercice[s]?\\s+pratique[s]?',
  'Auto-évaluation',
  'Introduction',
  'Conclusion',
  'Résumé',
  'Point[s]?\\s+clé[s]?',
  'Définition[s]?',
  'À retenir',
  'Conseil[s]?',
  'Important[e]?',
  'Rappel',
  'Mise en pratique',
  'Pour aller plus loin',
  'Prérequis',
  'Étape\\s+\\d+',
  'Résultat[s]?\\s+attendu[s]?',
  'Compétence[s]?\\s+clé[s]?',
  'Bonne[s]?\\s+pratique[s]?',
  'À savoir',
  'En pratique',
  'Vocabulaire',
  'Astuce[s]?',
  'Attention',
]

const HIGHLIGHT_RE = new RegExp(
  `(?<!\\*)(\\b(?:${HIGHLIGHT_TERMS.join('|')})\\b)(?!\\*)`,
  'gi'
)

function autoHighlight(text: string): string {
  return text.replace(HIGHLIGHT_RE, '**$1**')
}

function parseInline(text: string, key: number): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(https?:\/\/[^\s)>\]"]+)/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }
    if (match[1]) {
      parts.push(<strong key={`b-${match.index}`} className="font-semibold text-gray-900">{match[2]}</strong>)
    } else if (match[3]) {
      parts.push(<em key={`i-${match.index}`}>{match[4]}</em>)
    } else if (match[5]) {
      parts.push(
        <a
          key={`url-${match.index}`}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-green underline break-all"
        >
          {match[5]}
        </a>
      )
    }
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 1 ? parts[0] : <React.Fragment key={key}>{parts}</React.Fragment>
}

export default function MarkdownContent({ text, className = '' }: Props) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      elements.push(<div key={`space-${i}`} className="h-4" />)
      i++
      continue
    }

    // ## Heading 2
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="font-bold text-gray-900 text-lg mt-6 mb-2">
          {parseInline(autoHighlight(line.slice(3)), i)}
        </h3>
      )
      i++
      continue
    }

    // ### Heading 3
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="font-semibold text-gray-800 text-base mt-5 mb-1.5">
          {parseInline(autoHighlight(line.slice(4)), i)}
        </h4>
      )
      i++
      continue
    }

    // **Titre :** seul sur une ligne
    if (/^\*\*[^*]+\*\*\s*:?\s*$/.test(line.trim())) {
      elements.push(
        <h4 key={i} className="font-bold text-gray-900 text-base mt-6 mb-2">
          {parseInline(line.trim().replace(/^\*\*|\*\*\s*:?\s*$/g, ''), i)}
        </h4>
      )
      i++
      continue
    }

    // - bullet list or • bullet
    if (/^[-•]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-•]\s+/, ''))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2.5 my-3 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2.5 text-base text-gray-800 leading-7">
              <span className="text-brand-green mt-1 shrink-0">•</span>
              <span className="text-justify">{parseInline(autoHighlight(item), j)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list: 1. item
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      const startNum = parseInt(line)
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2.5 my-3 pl-1" start={startNum}>
          {items.map((item, j) => (
            <li key={j} className="flex gap-2.5 text-base text-gray-800 leading-7">
              <span className="text-brand-green font-semibold shrink-0 w-4">{startNum + j}.</span>
              <span className="text-justify">{parseInline(autoHighlight(item), j)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="text-base text-gray-800 leading-7 text-justify">
        {parseInline(autoHighlight(line), i)}
      </p>
    )
    i++
  }

  return <div className={`space-y-1 ${className}`}>{elements}</div>
}
