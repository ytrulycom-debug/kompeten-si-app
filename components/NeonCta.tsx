'use client'

import TubesBackground from '@/components/ui/neon-flow'

interface Props {
  telegramLink: string
}

export default function NeonCta({ telegramLink }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl shadow-card-lg">
      <TubesBackground className="min-h-[280px] bg-black" enableClickInteraction={true}>
        <div className="pointer-events-auto flex flex-col items-center justify-center px-6 py-10 text-center text-white sm:py-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Passage \u00e0 l&apos;action
          </p>
          <h3 className="mt-3 text-2xl font-black tracking-tight drop-shadow-[0_0_12px_rgba(0,0,0,0.8)]">
            Re\u00e7ois tes 7 le\u00e7ons sur Telegram
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-lg leading-relaxed text-white/80">
            Appuie sur le bouton, puis sur{' '}
            <strong className="text-white">Start</strong> dans Telegram.
            Ton parcours d\u00e9marre automatiquement. Une le\u00e7on par matin.
          </p>
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-lg font-bold text-brand-green shadow-lg transition hover:bg-green-50 hover:scale-105"
          >
            D\u00e9marrer gratuitement \u2192
          </a>
          <p className="mt-3 text-sm text-white/50">
            Aucun compte n\u00e9cessaire \u00b7 Gratuit
          </p>
          <p className="mt-4 text-xs text-white/30 animate-pulse">
            Clique pour changer les couleurs
          </p>
        </div>
      </TubesBackground>
    </section>
  )
}
