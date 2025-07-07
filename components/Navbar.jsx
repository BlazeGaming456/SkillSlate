//Navbar component for the Skill Slate application

'use client'

import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { data: session, status } = useSession()
  const [showMenu, setShowMenu] = useState(false)
  const pathname = usePathname()
  const defaultImage = '/default-profile.png'

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  const isHomePage = pathname === '/'

  return (
    <div className='flex items-center justify-between p-4 h-16 bg-[#1c1c1c] border-b border-gray-700 relative'>
      {/* Left side - Logo */}
      <Link href='/'>
        <div className='flex items-center gap-x-2 group cursor-pointer'>
          <Image src='/logo.png' alt='Skill Slate' width={40} height={40} />
          <span className='pt-0.5 font-sans font-bold text-white group-hover:text-[#00f5a0] text-2xl transition-colors duration-300'>
            Skill Slate
          </span>
        </div>
      </Link>

      {/* Center - Navigation Links (only on home page) */}
      {isHomePage && (
        <ul className='hidden md:flex text-white font-mono gap-x-8 text-lg'>
          <li>
            <a
              href='#features'
              className='hover:text-[#00f5a0] transition-colors duration-300 cursor-pointer'
            >
              Features
            </a>
          </li>
          <li>
            <a
              href='#prices'
              className='hover:text-[#00f5a0] transition-colors duration-300 cursor-pointer'
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href='#faq'
              className='hover:text-[#00f5a0] transition-colors duration-300 cursor-pointer'
            >
              FAQs
            </a>
          </li>
        </ul>
      )}

      {/* Right side - Profile/Login */}
      <div className='relative flex items-center gap-4'>
        {/* Profile/Login Button - depending on if authenticated or not*/}
        {status === 'authenticated' ? (
          <div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className='hover:opacity-80 transition-opacity duration-300 focus:outline-none'
            >
              <Image
                src={session.user?.image || defaultImage}
                alt='Profile'
                width={40}
                height={40}
                className='rounded-full border-2 border-gray-600 hover:border-[#00f5a0] transition-colors duration-300'
              />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className='absolute right-0 mt-2 w-48 bg-[#2a2a2a] rounded-xl shadow-2xl border border-gray-600 overflow-hidden z-50'
                >
                  <div className='p-4 border-b border-gray-600'>
                    <p className='text-white font-mono font-bold text-sm'>
                      {session.user?.name || 'User'}
                    </p>
                    <p className='text-gray-400 font-mono text-xs'>
                      {session.user?.email}
                    </p>
                  </div>

                  <div className='py-2'>
                    <Link href='/dashboard'>
                      <button className='w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3a] font-mono text-sm transition-colors duration-200'>
                        Dashboard
                      </button>
                    </Link>
                    <Link href='/generate/resume'>
                      <button className='w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3a] font-mono text-sm transition-colors duration-200'>
                        Generate Resume
                      </button>
                    </Link>
                    <Link href='/generate/cover-letter'>
                      <button className='w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3a] font-mono text-sm transition-colors duration-200'>
                        Cover Letter
                      </button>
                    </Link>
                    <Link href='/improve'>
                      <button className='w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3a] font-mono text-sm transition-colors duration-200'>
                        Improve Resume
                      </button>
                    </Link>
                    <Link href='/github'>
                      <button className='w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#3a3a3a] font-mono text-sm transition-colors duration-200'>
                        GitHub Review
                      </button>
                    </Link>
                  </div>

                  <div className='border-t border-gray-600 py-2'>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-[#3a3a3a] font-mono text-sm transition-colors duration-200'
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href='/login'
            className='hover:opacity-80 transition-opacity duration-300'
          >
            <div className='w-10 h-10 bg-[#00f5a0] rounded-full flex items-center justify-center border-2 border-gray-600 hover:border-[#00f5a0] transition-colors duration-300'>
              <svg
                className='w-5 h-5 text-black'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </Link>
        )}
      </div>

      {/* Backdrop to close menu when clicking outside */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
            className='fixed inset-0 z-40'
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar
