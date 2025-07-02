'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
  const { data: session, status } = useSession()
  const defaultImage = '/default-profile.png' // Store this in /public folder

  return (
    <div className='flex items-center justify-between p-4 bg-white shadow-md'>
      <Link href='/' className='hover:cursor-pointer'><span className='text-xl font-bold'>Skill Slate!</span></Link>
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
      </div>
    </div>
  )
}

export default Navbar
