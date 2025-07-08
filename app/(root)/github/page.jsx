//Generates summary, pros, cons, and future steps for a GitHub profile using AI

'use client'

import React from 'react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

const page = () => {
  const [username, setUsername] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [summary, setSummary] = useState('')
  const [guide, setGuide] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    if (!username) {
      setError('Invalid Github Username!')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/github-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })

      const { pros, cons, summary, guide } = await res.json()
      setPros(pros)
      setCons(cons)
      setSummary(summary)
      setGuide(guide)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-2 min-h-screen bg-slate-300'>
      {/* Form Section */}
      <AnimatePresence>
        <motion.div
          className='w-full flex justify-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, ease: 'easeInOut', duration: 0.6 }}
        >
          <div className='bg-[#3a3a3a] p-4 w-full max-w-lg rounded-xl border-gray-600 mx-auto'>
            <h1 className='font-mono text-white text-center text-2xl mb-3 font-bold'>
              GitHub AI Review
            </h1>
            <form onSubmit={e => handleSubmit(e)} className='flex flex-col'>
              <input
                type='text'
                className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full h-12 resize-none'
                placeholder='Enter your GitHub Username'
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <motion.button
                disabled={loading}
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='w-1/2 mt-3 self-center px-4 py-2 bg-[#00f5a0] text-black font-mono rounded-md
           disabled:bg-gray-400 hover:bg-[#00d488] transition-all duration-300 transform hover:transform-scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed hover:cursor-pointer'
              >
                {loading ? 'Processing...' : 'Analyze Profile'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Error Message */}
      {error && <p className='text-red-500'>Error: {error.message}</p>}

      {/* Results Section */}
      <div className='w-full p-6 gap-6 space-y-6'>
        <div>
          {/* Summary Card */}
          {summary && (
            <motion.div
              className='bg-gradient-to-br rounded-2xl from-slate-600 via-slate-700 to-slate-800  shadow-2xl border border-slate-600 p-8 backdrop-blur-sm'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <div className='flex items-center mb-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mr-3'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h3 className='font-bold text-2xl text-white'>Summary</h3>
              </div>
              <ReactMarkdown
                components={{
                  ul: ({ node, ...props }) => (
                    <ul
                      className='list-disc ml-6 text-gray-200 space-y-2'
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className='mb-2 leading-relaxed' {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className='mb-3 text-gray-200 leading-relaxed'
                      {...props}
                    />
                  )
                }}
              >
                {summary ?? ''}
              </ReactMarkdown>
            </motion.div>
          )}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Pros Card */}
          {pros && (
            <motion.div
              className='bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 rounded-2xl shadow-2xl border border-emerald-600 p-8 backdrop-blur-sm'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <div className='flex items-center mb-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center mr-3'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h3 className='font-bold text-2xl text-emerald-100'>Pros</h3>
              </div>
              <ReactMarkdown
                components={{
                  ul: ({ node, ...props }) => (
                    <ul
                      className='list-disc ml-6 text-emerald-100 space-y-2'
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className='mb-2 leading-relaxed' {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className='mb-3 text-emerald-100 leading-relaxed'
                      {...props}
                    />
                  )
                }}
              >
                {pros ?? ''}
              </ReactMarkdown>
            </motion.div>
          )}
          {/* Cons Card */}
          {cons && (
            <motion.div
              className='bg-gradient-to-br from-red-900 via-red-800 to-pink-800 rounded-2xl shadow-2xl border border-red-600 p-8 backdrop-blur-sm'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <div className='flex items-center mb-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center mr-3'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h3 className='font-bold text-2xl text-red-100'>Cons</h3>
              </div>
              <ReactMarkdown
                components={{
                  ul: ({ node, ...props }) => (
                    <ul
                      className='list-disc ml-6 text-red-100 space-y-2'
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className='mb-2 leading-relaxed' {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className='mb-3 text-red-100 leading-relaxed'
                      {...props}
                    />
                  )
                }}
              >
                {cons ?? ''}
              </ReactMarkdown>
            </motion.div>
          )}
        </div>
        <div>
          {/* Guide Card */}
          {guide && (
            <motion.div
              className='bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-800 rounded-2xl shadow-2xl border border-amber-600 p-8 backdrop-blur-sm'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <div className='flex items-center mb-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-3'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <h3 className='font-bold text-2xl text-amber-100'>
                  Future Steps
                </h3>
              </div>
              <ReactMarkdown
                components={{
                  ul: ({ node, ...props }) => (
                    <ul
                      className='list-disc ml-6 text-amber-100 space-y-2'
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className='mb-2 leading-relaxed' {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className='mb-3 text-amber-100 leading-relaxed'
                      {...props}
                    />
                  )
                }}
              >
                {guide ?? ''}
              </ReactMarkdown>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page
