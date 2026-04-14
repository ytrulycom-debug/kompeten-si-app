export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const chatId = searchParams.get('chat_id')

  if (!chatId) {
    return Response.json({ error: 'chat_id manquant' }, { status: 400 })
  }

  const userWebhookUrl = process.env.N8N_USER_WEBHOOK_URL
  const formWebhookUrl = process.env.N8N_WEBHOOK_URL

  if (!userWebhookUrl || !formWebhookUrl) {
    return Response.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  // 1. Lookup utilisateur
  const userRes = await fetch(`${userWebhookUrl}?chat_id=${encodeURIComponent(chatId)}`, { cache: 'no-store' })
  if (!userRes.ok) {
    return Response.json({ error: 'Erreur serveur' }, { status: 502 })
  }
  const user = await userRes.json()

  if (!user.found) {
    return Response.json({ error: 'Utilisateur non trouv\u00e9' }, { status: 404 })
  }

  // 2. Calcul du jour actuel
  const dateInscription = new Date(user.date_inscription)
  const today = new Date()
  const diffDays = Math.floor(
    (today.getTime() - dateInscription.getTime()) / 86400000
  )
  const jourActuel = Math.min(7, Math.max(1, diffDays + 1))

  // 3. R\u00e9cup\u00e9rer les formations
  const formRes = await fetch(formWebhookUrl, { cache: 'no-store' })
  if (!formRes.ok) {
    return Response.json({ error: 'Impossible de charger les formations' }, { status: 502 })
  }
  const formData = await formRes.json()

  const rang = parseInt(user.competence_choisie)
  const competence = formData.competences?.find((c: { rang: number }) => c.rang === rang)

  const contenuBrut = competence?.jours?.[jourActuel - 1] ?? ''
  const contenuNettoye = contenuBrut.replace(/\|\|\|[\s\S]*$/, '').trim()

  return Response.json({
    jour_actuel: jourActuel,
    rang,
    competence: competence?.competence ?? '',
    contenu_du_jour: contenuNettoye,
    nb_offres: competence?.nb_offres ?? 0,
    semaine: formData.semaine ?? '',
  })
}
