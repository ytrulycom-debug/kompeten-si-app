import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-lg font-semibold text-gray-700">Page introuvable</h2>
      <p className="text-sm text-gray-500 mt-2">
        La compétence demandée n&apos;existe pas.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 bg-brand-green text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
