'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

interface Props {
  children: React.ReactNode
  className?: string
}

export function StaggerGrid({ children, className }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: Props) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
