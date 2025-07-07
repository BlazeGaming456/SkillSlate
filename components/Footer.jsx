//Footer component for the Skill Slate application

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer () {
  return (
    <footer className='bg-[#1c1c1c] border-t border-gray-700'>
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='col-span-1 md:col-span-2'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href='/'>
                <h3 className='text-2xl font-bold text-white font-mono mb-4 hover:text-[#00f5a0] transition-colors duration-300'>
                  Skill Slate
                </h3>
              </Link>
              <p className='text-gray-400 font-mono mb-6 leading-relaxed'>
                The fastest way to generate, improve, and ace your developer
                resume. AI-powered tools to help you stand out in the job
                market.
              </p>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className='text-white font-mono font-bold mb-4'>Quick Links</h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/#features'
                  className='text-gray-400 hover:text-[#00f5a0] font-mono text-sm transition-colors duration-300'
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href='/#prices'
                  className='text-gray-400 hover:text-[#00f5a0] font-mono text-sm transition-colors duration-300'
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='/#faq'
                  className='text-gray-400 hover:text-[#00f5a0] font-mono text-sm transition-colors duration-300'
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href='/login'
                  className='text-gray-400 hover:text-[#00f5a0] font-mono text-sm transition-colors duration-300'
                >
                  Login
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className='text-white font-mono font-bold mb-4'>Tools</h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/generate/resume'
                  className='text-gray-400 hover:text-[#00f5a0] font-mono text-sm transition-colors duration-300'
                >
                  Generate Resume
                </Link>
              </li>
              <li>
                <Link
                  href='/generate/cover-letter'
                  className='text-gray-400 hover:text-[#00f5a0] font-mono text-sm transition-colors duration-300'
                >
                  Cover Letters
                </Link>
              </li>
              <li>
                <Link
                  href='/improve'
                  className='text-gray-400 hover:text-[#00f5a0] font-mono text-sm transition-colors duration-300'
                >
                  Improve Resume
                </Link>
              </li>
              <li>
                <Link
                  href='/github'
                  className='text-gray-400 hover:text-[#00f5a0] font-mono text-sm transition-colors duration-300'
                >
                  GitHub Review
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className='border-t border-gray-700 mt-12 pt-8'
        >
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-400 font-mono text-sm mb-4 md:mb-0'>
              © Ajin Chundakkattu Raju 🤪.
            </p>
            <div className='flex space-x-6'>
              <span className='text-gray-400 font-mono'>Expect more features soon!</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
