//Login page using Google OAuth with NextAuth.js and Framer Motion for animations

'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginButton () {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[#00f5a0] mx-auto mb-4'></div>
          <div className='text-[#00f5a0] text-xl font-mono font-bold animate-pulse'>
            Loading...
          </div>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[#00f5a0] mx-auto mb-4'></div>
          <div className='text-[#00f5a0] text-xl font-mono font-bold animate-pulse'>
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] flex items-center justify-center p-6'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-20 left-20 w-72 h-72 bg-[#00f5a0] rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-[#00f5a0] rounded-full blur-3xl'></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='relative z-10 w-full max-w-md'
      >
        {/* Login Card */}
        <div className='bg-[#2a2a2a] rounded-2xl shadow-2xl border border-gray-600 p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='w-20 h-20 bg-[#00f5a0] rounded-full flex items-center justify-center mx-auto mb-6'
            >
              <span className='text-3xl'>🚀</span>
            </motion.div>
            <h1 className='text-3xl font-bold text-white font-mono mb-2'>
              Welcome to SkillSlate
            </h1>
            <p className='text-gray-400 font-mono'>
              Sign in to access your resume builder
            </p>
          </div>

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => signIn('google')}
              className='w-full bg-white hover:bg-gray-100 text-gray-800 font-mono font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3'
            >
              <svg className='w-6 h-6' viewBox='0 0 24 24'>
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className='mt-8 pt-8 border-t border-gray-600'
          >
            <div className='space-y-3 text-sm text-gray-400'>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-[#00f5a0] rounded-full'></div>
                <span className='font-mono'>AI-powered resume generation</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-[#00f5a0] rounded-full'></div>
                <span className='font-mono'>ATS-optimized formatting</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-[#00f5a0] rounded-full'></div>
                <span className='font-mono'>Professional templates</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Part */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className='text-center mt-6'
        >
          <p className='text-gray-500 text-sm font-mono'>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
