//Used in the home page to create a fade-in effect for sections

import { motion } from 'framer-motion'

export default function FadeSection ({ children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='min-h-screen flex items-center justify-center'
    >
      {children}
    </motion.section>
  )
}