import { NextResponse } from 'next/server'

// Revalide les données côté Next.js toutes les heures
export const revalidate = 3600

export async function GET() {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL non configuré' },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`n8n a répondu avec le statut ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[KompetenSI API] Erreur:', err)
    return NextResponse.json(
      { error: 'Impossible de récupérer les données depuis n8n' },
      { status: 502 }
    )
  }
}
