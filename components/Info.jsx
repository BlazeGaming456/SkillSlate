//Info Section on the Home Page

'use client'

import React from 'react'
import { motion } from 'framer-motion'

const features = [
  {
    id: 1,
    title: 'AI-Powered Resume Generation',
    description:
      'Create professional, ATS-optimized resumes in minutes using advanced AI that understands industry standards and job requirements.',
    //Icon provided by AI
    icon: (
      <svg
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        />
      </svg>
    ),
    gradient: 'from-emerald-400 to-cyan-400',
    bgGradient: 'from-emerald-50 to-cyan-50'
  },
  {
    id: 2,
    title: 'Smart Resume Enhancement',
    description:
      'Get intelligent suggestions to improve your resume with actionable feedback on content, formatting, and keyword optimization.',
    icon: (
      <svg
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M13 10V3L4 14h7v7l9-11h-7z'
        />
      </svg>
    ),
    gradient: 'from-blue-400 to-indigo-400',
    bgGradient: 'from-blue-50 to-indigo-50'
  },
  {
    id: 3,
    title: 'Professional Cover Letters',
    description:
      'Generate compelling cover letters tailored to specific job descriptions and company cultures for maximum impact.',
    icon: (
      <svg
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        />
      </svg>
    ),
    gradient: 'from-purple-400 to-pink-400',
    bgGradient: 'from-purple-50 to-pink-50'
  },
  {
    id: 4,
    title: 'GitHub Profile Optimization',
    description:
      'Transform your GitHub profile into a powerful portfolio with AI-driven recommendations for projects, descriptions, and presentation.',
    icon: (
      <svg
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
        />
      </svg>
    ),
    gradient: 'from-orange-400 to-red-400',
    bgGradient: 'from-orange-50 to-red-50'
  }
]

export default function Info () {
  return (
    <section className='w-full py-20 bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <motion.h2 className='hidden md:block text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Why Choose{' '}
            <span className='bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent'>
              SkillSlate
            </span>
            ?
          </motion.h2>
          <motion.h2 className='block md:hidden text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Why Choose{' '}
            <span className='bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent'>
              SkillSlate
            </span>
            ?
          </motion.h2>
          <motion.p className='hidden md:block text-xl text-gray-600 max-w-3xl mx-auto'>
            Experience the future of career development with our comprehensive
            suite of AI-powered tools designed to elevate your professional
            presence.
          </motion.p>
          <motion.p className='block md:hidden text-xl text-gray-600 max-w-3xl mx-auto'>
            Experience the future of career development with our comprehensive
            suite of AI-powered tools designed to elevate your professional
            presence.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>
          {features.map((feature, index) => (
            <React.Fragment key={feature.id}>
              <motion.div
                className='hidden md:block'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className='group relative'
              >
                <div
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.bgGradient} p-8 shadow-lg border border-gray-200/50 transition-all duration-300 group-hover:shadow-xl`}
                >
                  {/* Background Pattern */}
                  <div className='absolute inset-0 opacity-5'>
                    <div className='absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700'></div>
                  </div>

                  {/* Content */}
                  <div className='relative z-10'>
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>

                    {/* Text */}
                    <h3 className='text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 text-lg leading-relaxed'>
                      {feature.description}
                    </p>

                    {/* Hover Effect */}
                    <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left'></div>
                  </div>
                </div>
              </motion.div>
              <div className='block md:hidden group relative'>
                <div
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.bgGradient} p-8 shadow-lg border border-gray-200/50 transition-all duration-300 group-hover:shadow-xl`}
                >
                  {/* Background Pattern */}
                  <div className='absolute inset-0 opacity-5'>
                    <div className='absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700'></div>
                  </div>

                  {/* Content */}
                  <div className='relative z-10'>
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>

                    {/* Text */}
                    <h3 className='text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 text-lg leading-relaxed'>
                      {feature.description}
                    </p>

                    {/* Hover Effect */}
                    <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left'></div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className='hidden md:block text-center mt-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className='inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
            <span>Meet our features below!</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
