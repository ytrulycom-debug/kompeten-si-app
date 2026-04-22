export const dynamic = 'force-dynamic'

async function fetchJson(url: string) {
  const res = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  })

  if (!res.ok) {
    throw new Error(`Upstream a répondu avec le statut ${res.status}`)
  }

  return res.json()
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const chatId = searchParams.get('chat_id')?.trim()

  if (!chatId) {
    return Response.json({ error: 'chat_id manquant' }, { status: 400 })
  }

  const userWebhookUrl = process.env.N8N_USER_WEBHOOK_URL
  const formWebhookUrl = process.env.N8N_WEBHOOK_URL

  if (!userWebhookUrl || !formWebhookUrl) {
    return Response.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  try {
    const user = await fetchJson(
      `${userWebhookUrl}?chat_id=${encodeURIComponent(chatId)}`
    )

    if (!user?.found) {
      return Response.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const dateInscription = new Date(user.date_inscription)
    const jourActuel = Number.isNaN(dateInscription.getTime())
      ? 1
      : Math.min(7, Math.max(1, Math.floor((Date.now() - dateInscription.getTime()) / 86400000) + 1))

    const formData = await fetchJson(formWebhookUrl)
    const rang = Number.parseInt(user.competence_choisie, 10)

    if (!Number.isInteger(rang)) {
      return Response.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const competence = formData.competences?.find(
      (c: { rang: number }) => c.rang === rang
    )

    if (!competence) {
      return Response.json(
        { error: 'Compétence introuvable dans les données de formation' },
        { status: 404 }
      )
    }

    const tousLesJours: string[] = (competence.jours ?? []).map((j: string) =>
      j.replace(/\|\|\|[\s\S]*$/, '').trim()
    )

    const contenuNettoye = tousLesJours[jourActuel - 1] ?? ''

    return Response.json({
      jour_actuel: jourActuel,
      rang,
      competence: competence.competence ?? '',
      contenu_du_jour: contenuNettoye,
      tous_les_jours: tousLesJours,
      nb_offres: competence.nb_offres ?? 0,
      semaine: formData.semaine ?? '',
    })
  } catch (error) {
    console.error('[KompetenSI mon-parcours] Erreur:', error)
    return Response.json(
      { error: 'Impossible de récupérer le parcours utilisateur' },
      { status: 502 }
    )
  }
}
