'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const colorMap = {
  orange: {
    border: 'border-orange-300',
    glow: '0 0 0 4px rgba(251,191,36,0.4)',
    bg: 'bg-orange-50',
    dot: 'bg-orange-400',
    arrow: 'text-orange-500',
    icon: (
      <svg width='72' height='72' fill='none' viewBox='0 0 72 72'>
        <rect x='10' y='18' width='52' height='36' rx='8' fill='#FDBA74' />
        <rect x='18' y='28' width='36' height='8' rx='2' fill='#fff' />
        <rect x='18' y='40' width='24' height='4' rx='2' fill='#fff' />
        <rect x='18' y='48' width='12' height='4' rx='2' fill='#fff' />
      </svg>
    )
  },
  blue: {
    border: 'border-blue-300',
    glow: '0 0 0 4px rgba(59,130,246,0.4)',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    arrow: 'text-blue-500',
    icon: (
      <svg width='72' height='72' fill='none' viewBox='0 0 72 72'>
        <circle cx='36' cy='36' r='28' fill='#60A5FA' />
        <path
          d='M24 36h24M36 24v24'
          stroke='#fff'
          strokeWidth='4'
          strokeLinecap='round'
        />
      </svg>
    )
  },
  green: {
    border: 'border-green-300',
    glow: '0 0 0 4px rgba(34,197,94,0.4)',
    bg: 'bg-green-50',
    dot: 'bg-green-400',
    arrow: 'text-green-500',
    icon: (
      <svg width='72' height='72' fill='none' viewBox='0 0 72 72'>
        <rect x='14' y='20' width='44' height='32' rx='8' fill='#6EE7B7' />
        <rect x='22' y='28' width='28' height='8' rx='2' fill='#fff' />
        <rect x='22' y='40' width='16' height='4' rx='2' fill='#fff' />
        <circle cx='36' cy='36' r='6' fill='#22C55E' />
      </svg>
    )
  },
  red: {
    border: 'border-red-300',
    glow: '0 0 0 4px rgba(239,68,68,0.4)',
    bg: 'bg-red-50',
    dot: 'bg-red-400',
    arrow: 'text-red-500',
    icon: (
      <svg width='72' height='72' fill='none' viewBox='0 0 72 72'>
        <rect x='14' y='20' width='44' height='32' rx='8' fill='#FCA5A5' />
        <rect x='22' y='28' width='28' height='8' rx='2' fill='#fff' />
        <rect x='22' y='40' width='20' height='4' rx='2' fill='#fff' />
        <rect x='22' y='48' width='8' height='4' rx='2' fill='#fff' />
        <path
          d='M36 28v16'
          stroke='#EF4444'
          strokeWidth='3'
          strokeLinecap='round'
        />
      </svg>
    )
  },
  purple: {
    border: 'border-purple-300',
    glow: '0 0 0 4px rgba(168,85,247,0.4)',
    bg: 'bg-purple-50',
    dot: 'bg-purple-400',
    arrow: 'text-purple-500',
    icon: (
      <svg width='72' height='72' fill='none' viewBox='0 0 72 72'>
        <rect x='16' y='24' width='40' height='24' rx='8' fill='#C4B5FD' />
        <rect x='24' y='32' width='24' height='8' rx='2' fill='#fff' />
        <circle cx='36' cy='36' r='6' fill='#8B5CF6' />
        <path
          d='M36 28v16'
          stroke='#8B5CF6'
          strokeWidth='3'
          strokeLinecap='round'
        />
      </svg>
    )
  }
}

const features = [
  {
    title: 'Resume Generation',
    subtitle: 'Create a professional resume in seconds with AI.',
    color: 'orange',
    link: '/generate/resume'
  },
  {
    title: 'Improve your Resume',
    subtitle: 'Get personalized tips to improve your resume.',
    color: 'blue',
    link: '/improve'
  },
  {
    title: 'Dashboard',
    subtitle: 'Download your resume in PDF or LaTeX instantly.',
    color: 'green',
    link: '/dashboard'
  },
  {
    title: 'Generate Cover Letter',
    subtitle: 'Craft tailored cover letters for job applications.',
    color: 'red',
    link: '/generate/cover-letter'
  },
  {
    title: 'GitHub Review',
    subtitle: 'Enhance your GitHub profile with expert feedback.',
    color: 'purple',
    link: '/github'
  }
]

export default function Features () {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  return (
    <div className='w-full max-w-6xl mx-auto py-16'>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='font-mono font-bold text-3xl md:text-4xl mb-12 text-gray-900 text-center'
      >
        Our Features
      </motion.h2>
      <div className='grid grid-cols-1 gap-10'>
        {features.map((feature, idx) => {
          const color = colorMap[feature.color]
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link
                href={feature.link}
                className='group block focus:outline-none'
              >
                <motion.div
                  className={`relative flex flex-col md:flex-row items-stretch rounded-3xl shadow-xl border-2 ${color.border} ${color.bg} transition-all duration-300 overflow-hidden cursor-pointer`}
                  style={{
                    minHeight: 220,
                    boxShadow: hoveredIdx === idx ? color.glow : undefined
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Left: Text */}
                  <div className='flex-1 flex flex-col items-start justify-start px-8 pt-8 pb-6 md:py-10'>
                    <div className='flex items-center gap-3 mb-2'>
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${color.dot}`}
                      ></span>
                      <span className='uppercase text-xs font-mono tracking-widest text-gray-500'>
                        Feature
                      </span>
                    </div>
                    <h3 className='text-2xl md:text-3xl font-extrabold font-mono mb-3 text-gray-900'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-700 font-sans text-lg md:text-xl'>
                      {feature.subtitle}
                    </p>
                  </div>
                  {/* Right: Icon */}
                  <div className='flex-shrink-0 flex items-center justify-center w-full md:w-[340px] h-[180px] md:h-[220px] relative'>
                    {color.icon}
                  </div>
                  {/* Animated Arrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      hoveredIdx === idx
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -20 }
                    }
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`absolute bottom-6 left-6 bg-white rounded-full shadow-md border-2 border-gray-200 flex items-center justify-center w-10 h-10 ${color.arrow} text-2xl`}
                    style={{ pointerEvents: 'none' }}
                  >
                    &rarr;
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
