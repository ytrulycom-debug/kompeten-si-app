'use client'

import React from 'react'

interface Props {
  text: string
  className?: string
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
      parts.push(<strong key={`b-${match.index}`} className="font-semibold">{match[2]}</strong>)
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
      elements.push(<div key={`space-${i}`} className="h-2" />)
      i++
      continue
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="font-bold text-gray-900 text-sm mt-3 mb-1">
          {parseInline(line.slice(3), i)}
        </h3>
      )
      i++
      continue
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="font-semibold text-gray-800 text-sm mt-2 mb-0.5">
          {parseInline(line.slice(4), i)}
        </h4>
      )
      i++
      continue
    }

    if (/^\*\*[^*]+\*\*\s*:?\s*$/.test(line.trim())) {
      elements.push(
        <h4 key={i} className="font-bold text-gray-900 text-sm mt-3 mb-1">
          {parseInline(line.trim().replace(/^\*\*|\*\*\s*:?\s*$/g, ''), i)}
        </h4>
      )
      i++
      continue
    }

    if (/^[-•]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-•]\s+/, ''))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-1 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm text-gray-800 leading-relaxed">
              <span className="text-brand-green mt-0.5 shrink-0">•</span>
              <span className="text-justify">{parseInline(item, j)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      const startNum = parseInt(line)
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1 my-1 pl-1" start={startNum}>
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm text-gray-800 leading-relaxed">
              <span className="text-brand-green font-semibold shrink-0 w-4">{startNum + j}.</span>
              <span className="text-justify">{parseInline(item, j)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    elements.push(
      <p key={i} className="text-sm text-gray-800 leading-relaxed text-justify">
        {parseInline(line, i)}
      </p>
    )
    i++
  }

  return <div className={`space-y-0.5 ${className}`}>{elements}</div>
}
