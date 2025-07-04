'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Typewriter } from 'react-simple-typewriter'

const page = () => {
  return (
    <div className='flex flex-col bg-primary'>
      {/* <Link href='/generate/resume' >Generate Resume</Link>
      <Link href='/generate/cover-letter' >Generate Cover Letter</Link>
      <Link href='/improve' >Improve Resume</Link>
      <Link href='/job-description' >Job Description</Link>
      <Link href='/dashboard' >Dashboard</Link>
      <Link href='/github'>GitHub Review</Link> */}

      <section id="hero" className='bg-[#1c1c1c] min-h-screen'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className=' flex justify-center w-full'>
            <Image src="/hero.svg" width={120} height={120} alt="Hero Image" className="w-full max-w-[500px] h-auto" priority />
          </div>
          <div>
            <div>
              <span><Typewriter
               words={['resume','SWE CV']} 
               loop={true}
               cursor
               cursorStyle="|"
               textSpeed={70}
               deleteSpeed={40}
               delaySpeed={1500}
               /></span>
            </div>
          </div>
        </div>
      </section>

      <section id="info" className='min-h-screen bg-gray-300'>

      </section>

      <section id="features" className='min-h-screen bg-white'>

      </section>

      <section id="info" className='min-h-screen bg-gray-300'>

      </section>
    </div>
  )
}

export default page