'use client'

import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function FadeUp({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
