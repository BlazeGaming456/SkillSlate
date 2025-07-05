'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Typewriter } from 'react-simple-typewriter'
import Info from '@/components/Info'
import Features from '@/components/Features'
import FadeSection from '@/components/FadeSection'

const page = () => {
  return (
    <div className='flex flex-col bg-primary'>
      {/* <Link href='/generate/resume' >Generate Resume</Link>
      <Link href='/generate/cover-letter' >Generate Cover Letter</Link>
      <Link href='/improve' >Improve Resume</Link>
      <Link href='/job-description' >Job Description</Link>
      <Link href='/dashboard' >Dashboard</Link>
      <Link href='/github'>GitHub Review</Link> */}

        <section id='hero' className='bg-[#1c1c1c] min-h-screen'>
          <div className='grid grid-cols-1 md:grid-cols-2'>
            <div className=' flex justify-center w-full'>
              <Image
                src='/hero.svg'
                width={120}
                height={120}
                alt='Hero Image'
                className='w-full max-w-[500px] h-auto'
                priority
              />
            </div>
            <div>
              <div className='text-white font-mono text-6xl'>
                <h1>The fastest way to</h1>
                <h1>
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
                <h1>your developer</h1>
                <h1>Resume</h1>
              </div>
              <div>
                <span>
                  SkillSlate uses AI to generate resumes that pass Applicant
                  Tracking Systems — and impress real recruiters.
                </span>
                <span>
                  No more formatting headaches or selecting templates.
                </span>
              </div>
              <div className='font-mono text-black'>
                <button className='bg-[#00f5a0] px-18 py-4'>
                  GENERATE YOUR RESUME
                </button>
              </div>
              <div>
                <ul>
                  <li>PDF, DOCX, and LaTeX support</li>
                  <li>Personalized AI suggestions</li>
                  <li>ATS-optimized formatting & keywords</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      <FadeSection>
        <section id='info' className='min-h-screen bg-gray-300 flex'>
          <Info />
        </section>
      </FadeSection>

      <FadeSection>
        <section id='features' className='min-h-screen bg-white'>
          <Features />
        </section>
      </FadeSection>

      <FadeSection>
        <section id='faq' className='min-h-screen bg-gray-300'>Hi</section>
      </FadeSection>

      <FadeSection>
        <section id='signup' className='min-h-screen bg-[#1c1c1c]'>Hi</section>
      </FadeSection>
    </div>
  )
}

export default page
