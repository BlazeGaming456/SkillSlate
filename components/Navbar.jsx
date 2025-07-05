'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
  const { data: session, status } = useSession()
  const defaultImage = '/default-profile.png' // Store this in /public folder

  return (
    <div className='flex items-center justify-between p-4 h-14 bg-[#1c1c1c]'>
      {/* <Link href='/' className='hover:cursor-pointer'><span className='text-xl font-bold'>Skill Slate!</span></Link>
      <ul className='flex space-x-4'>
        <li><Link href='/generate/resume' className='hover:cursor-pointer'>Generate Resume</Link></li>
        <li><Link href='/generate/cover-letter' className='hover:cursor-pointer'>Generate Cover Letter</Link></li>
        <li><Link href='/improve' className='hover:cursor-pointer'>Improve Resume</Link></li>
      </ul>
      <div className='rounded-full overflow-hidden'>
        <Link href='/login' className='hover:cursor-pointer'>
            <Image
            src={
                status === 'authenticated' && session.user?.image
                ? session.user.image
                : defaultImage
            }
            alt='Profile'
            width={40}
            height={40}
            />
        </Link>
      </div> */}
      <Link href='/'>
        <span className='font-sans font-bold text-white hover:text-[#00f5a0] hover:cursor-pointer text-2xl p-2'>Skill Slate</span>
      </Link>
      <ul className='flex text-white font-mono gap-x-8 text-lg'>
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#prices">Pricing</a>
        </li>
        <li>
          <a href="#faq">FAQs</a>
        </li>
      </ul>
      <div className='rounded-full overflow-hidden'>
        <Link href='/login' className='hover:cursor-pointer hover:opacity-80 bg-white'>
            <Image
            src={
                status === 'authenticated' && session.user?.image
                ? session.user.image
                : defaultImage
            }
            alt='Profile'
            width={40}
            height={40}
            />
        </Link>
      </div>
    </div>
  )
}

export default Navbar
