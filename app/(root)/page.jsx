'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Typewriter } from 'react-simple-typewriter'
import Info from '@/components/Info'
import Features from '@/components/Features'
import FadeSection from '@/components/FadeSection'
import { motion } from 'framer-motion'

const page = () => {
  return (
    <div className='flex flex-col bg-primary'>
      {/* Hero Section */}
      <section
        id='hero'
        className='bg-[#1c1c1c] min-h-screen flex items-center'
      >
        <div className='container mx-auto px-6 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            {/* Hero Image */}
            <div className='flex justify-center w-full'>
              <Image
                src='/hero.svg'
                width={120}
                height={120}
                alt='Hero Image'
                className='w-full max-w-[500px] h-auto'
                priority
              />
            </div>
            {/* Content */}
            <div className='flex flex-col justify-center h-full space-y-8'>
              <div className='text-white font-mono text-5xl md:text-6xl font-bold leading-tight'>
                <h1 className='mb-2'>The fastest way to</h1>
                <h1 className='mb-2 text-[#00f5a0]'>
                  <Typewriter
                    words={['Generate', 'Improve', 'Ace']}
                    loop={true}
                    cursor
                    cursorStyle='|'
                    textSpeed={70}
                    deleteSpeed={40}
                    delaySpeed={1500}
                  />
                </h1>
                <h1 className='mb-2'>your Developer</h1>
                <h1>Resume</h1>
              </div>
              <div className='space-y-2 text-lg text-gray-300 font-sans max-w-xl'>
                <p>
                  SkillSlate uses AI to generate resumes that pass ATS — and
                  impress real recruiters.
                </p>
                <p>No more formatting headaches or selecting templates.</p>
              </div>
              <div>
                <Link href='/generate/resume'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-[#00f5a0] hover:bg-[#00d488] text-black font-mono font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-[#00f5a0]/30 transition-all duration-300'
                  >
                    GENERATE YOUR RESUME
                  </motion.button>
                </Link>
              </div>
              <ul className='space-y-2 mt-2'>
                <li className='flex items-center gap-2 text-gray-200 font-mono text-base'>
                  <span className='text-[#00f5a0] text-lg'>✔</span> PDF and
                  LaTeX support
                </li>
                <li className='flex items-center gap-2 text-gray-200 font-mono text-base'>
                  <span className='text-[#00f5a0] text-lg'>✔</span> Personalized
                  AI suggestions
                </li>
                <li className='flex items-center gap-2 text-gray-200 font-mono text-base'>
                  <span className='text-[#00f5a0] text-lg'>✔</span>{' '}
                  ATS-optimized formatting & keywords
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <FadeSection>
        <section id='info' className='min-h-screen w-full bg-gray-300 flex'>
          <Info />
        </section>
      </FadeSection>

      {/* Features Section */}
      <FadeSection>
        <section id='features' className='min-h-screen bg-white'>
          <Features />
        </section>
      </FadeSection>

      {/* FAQ Section */}
      <FadeSection>
        <section
          id='faq'
          className='bg-gray-300 w-full min-h-screen flex items-center justify-center py-20'
        >
          <div className='w-full max-w-5xl px-4'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-5xl font-bold font-mono text-center mb-16'
            >
              Frequently Asked Questions
            </motion.h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
              {/* FAQ 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className='flex items-start gap-4'
              >
                <span className='mt-1 text-black text-xl font-bold'>→</span>
                <div>
                  <h3 className='text-xl font-bold font-mono mb-2'>
                    Is it free?
                  </h3>
                  <p className='font-sans text-base'>
                    You can generate and preview your resume for free. Some
                    advanced features and downloads may require a one-time
                    payment or subscription, but the core resume builder is
                    always free to use.
                  </p>
                </div>
              </motion.div>
              {/* FAQ 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='flex items-start gap-4'
              >
                <span className='mt-1 text-black text-2xl'>→</span>
                <div>
                  <h3 className='text-xl font-bold font-mono mb-2'>
                    Who is it intended for?
                  </h3>
                  <p className='font-sans text-base'>
                    SkillSlate is designed for developers, engineers, and tech
                    professionals who want to create modern, ATS-optimized
                    resumes quickly and easily. Anyone looking to improve their
                    tech resume can benefit from our tools.
                  </p>
                </div>
              </motion.div>
              {/* FAQ 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='flex items-start gap-4'
              >
                <span className='mt-1 text-black text-2xl'>→</span>
                <div>
                  <h3 className='text-xl font-bold font-mono mb-2'>
                    Is it a resume builder?
                  </h3>
                  <p className='font-sans text-base'>
                    Yes! SkillSlate is a full-featured resume builder with
                    AI-powered suggestions, live previews, and export options.
                    You can create, edit, and download your resume in multiple
                    formats.
                  </p>
                </div>
              </motion.div>
              {/* FAQ 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='flex items-start gap-4'
              >
                <span className='mt-1 text-black text-2xl'>→</span>
                <div>
                  <h3 className='text-xl font-bold font-mono mb-2'>
                    Do you plan to add more features?
                  </h3>
                  <p className='font-sans text-base'>
                    Absolutely! We are constantly working on new features,
                    including more export formats, advanced analytics, and
                    integrations. Stay tuned for updates and let us know what
                    you'd like to see next!
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* Pricing/Sign Up Section */}
      <FadeSection>
        <section
          id='prices'
          className='min-h-screen w-full bg-[#1c1c1c] flex items-center justify-center py-20'
        >
          <div className='w-full max-w-3xl px-4 text-center'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-5xl font-bold font-mono text-center mb-10 text-white'
            >
              Pricing
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='bg-[#232323] rounded-2xl shadow-2xl border border-gray-700 p-10 flex flex-col items-center'
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='text-5xl font-extrabold font-mono mb-4 text-[#00f5a0]'
              >
                100% Free
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='text-lg text-gray-300 font-sans mb-6'
              >
                No hidden fees. All features are available to everyone.
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='flex flex-col items-center gap-2'
              >
                <Link href='/dashboard'>
                  <motion.button
                    className='hover:cursor-pointer inline-block px-6 py-2 rounded-full bg-[#00f5a0] text-black font-mono font-bold text-lg shadow-md'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start using SkillSlate for free today!
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </FadeSection>
    </div>
  )
}

export default page
