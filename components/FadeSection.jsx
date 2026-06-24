//Used in the home page to create a fade-in effect for sections

import React from 'react'
import { motion } from 'framer-motion'

export default function FadeSection ({ children }) {
  return (
    <>
      {/* Desktop: fade-in animation */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='hidden md:block w-full'
      >
        {children}
      </motion.section>
      {/* Mobile: always visible, no animation */}
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className='block md:hidden w-full'
      >
        {children}
      </motion.section>
    </>
  )
}
