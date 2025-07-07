//Gives suggestions to improve the resume based on the job description and resume content

'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

export default function ImproveResume () {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [jobDetails, setJobDetails] = useState('')
  const [extraJD, setExtraJD] = useState({
    type: '',
    title: '',
    description: ''
  })
  const [url, setUrl] = useState('')

  const scrollRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [result])

  // Function to handle URL scraping
  // This function will scrape the job details from the provided URL
  const handleUrl = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.post('/api/scrape', { url })

      if (response.data.success) {
        console.log('Scraping result:', response.data.result)
        setExtraJD({
          type: response.data.result.type,
          title: response.data.result.title,
          description: response.data.result.description,
          skills: response.data.result.skills
        })
      } else {
        setError(response.data.error || 'Scraping failed')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(
        error.response?.data?.error || error.message || 'Failed to scrape URL'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle form submission
  // This function will upload the resume file and analyze it
  const handleSubmit = async e => {
    e.preventDefault()

    if (!file) {
      setError('Please select a PDF file')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await axios.post('/api/score', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const text = response.data.text

      const review = await axios.post(
        '/api/improve',
        { prompt: text, jobDetails: jobDetails, extraJD: extraJD },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )

      setResult(review.data)
    } catch (err) {
      console.error('Upload error:', err)
      const message = err?.response?.data?.error || 'Upload failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle file input button click
  // This function simulates a click on the hidden file input element
  const handleFileButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  return (
    <motion.div
      className='min-h-screen bg-gray-300 mx-auto p-6 md:flex'
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05, ease: 'easeInOut', duration: 0.4 }}
    >
      {/* Left Side - Form Section */}
      <AnimatePresence>
        <div className='bg-[#2a2a2a] p-12 w-1/2'>
          <div className='space-y-4 w-full'>
            <div className='w-full mb-8'>
              <label className='block mb-2 font-mono font-bold text-white text-3xl'>
                Resume Analyser
              </label>
            </div>
            {/* Resume Upload Section */}
            <div className=''>
              <label className='text-lg font-mono font-bold text-white w-full mb-4'>
                Upload your Resume
              </label>
              <div className='w-full flex flex-col items-start mt-4 overflow-visible'>
                <motion.button
                  type='button'
                  onClick={handleFileButtonClick}
                  className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-mono font-bold shadow-lg transition-all duration-300'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Choose File
                </motion.button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.pdf'
                  onChange={e => setFile(e.target.files[0])}
                  className='hidden'
                />
                {file && (
                  <span className=' text-gray-300 mt-1 text-sm opacity-50'>
                    {file.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className='mt-4 p-3 bg-red-50 text-red-700 rounded-md'>
              {error}
            </div>
          )}

          {/* Job Description Section */}
          <div className='mt-6 mb-4 flex flex-col'>
            <div className='flex flex-col p-8 gap-1 bg-[#3a3a3a] rounded-xl border border-gray-600'>
              <div className='flex flex-col gap-1'>
                <h2 className='text-white text-lg font-mono'>
                  Enter Job Description
                </h2>
                <textarea
                  name='job details'
                  className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full h-24 resize-none'
                  onChange={e => setJobDetails(e.target.value)}
                ></textarea>
              </div>

              <div className='flex mb-1 mt-3 flex-col gap-1'>
                <h2 className='text-white text-lg font-mono'>
                  Enter your Job URL (From LinkedIn, Internshala, etc.)
                </h2>
                <textarea
                  name='url'
                  onChange={e => setUrl(e.target.value)}
                  className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full h-14 resize-none'
                ></textarea>
              </div>

              <motion.button
                className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105 w-fit'
                onClick={handleUrl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Job Details
              </motion.button>
            </div>
          </div>
          <div className='w-full mt-8 flex items-center justify-center'>
            <motion.button
              disabled={!file || isLoading}
              onClick={handleSubmit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='w-1/2 px-4 py-2 bg-[#00f5a0] text-black font-mono rounded-md
           disabled:bg-gray-400 hover:bg-[#00d488] transition-all duration-300 transform hover:transform-scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed hover:cursor-pointer'
            >
              {isLoading ? 'Processing...' : 'Analyze PDF'}
            </motion.button>
          </div>
        </div>
      </AnimatePresence>

      {/* Right Side - Results Section */}
      <div className='bg-[#1c1c1c] p-12 w-1/2'>
        {result === null || typeof result.atsScore === 'undefined' ? (
          <div className='w-full h-full flex items-center justify-center'>
            <div className='text-white items-center justify-center font-mono'>
              Let's get to analyzing your resume!
            </div>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className='flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#00f5a0] scrollbar-track-[#e5e7eb]'
          >
            {/* Top Cards: Job Match & ATS Score */}
            <div className='flex flex-col md:flex-row gap-6 mb-2'>
              {/* Job Match Card */}
              {result?.jobMatch && (
                <motion.div
                  className='flex-1 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-400 rounded-2xl shadow-2xl border-4 border-amber-300 p-8 backdrop-blur-sm flex flex-col items-center justify-center min-w-[220px]'
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
                >
                  <div className='flex items-center mb-3'>
                    <div className='w-12 h-12 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-xl flex items-center justify-center mr-4 shadow-lg'>
                      <svg
                        className='w-7 h-7 text-white drop-shadow-lg'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <h3 className='font-bold text-2xl text-amber-900 drop-shadow'>
                      Job Match
                    </h3>
                  </div>
                  <div className='text-6xl font-mono font-extrabold text-amber-900 drop-shadow-lg text-center mb-2'>
                    {result?.jobMatch}/100
                  </div>
                  <div className='text-sm text-amber-800 font-semibold text-center'>
                    How well your resume matches the job
                  </div>
                </motion.div>
              )}
              {/* ATS Score Card */}
              {typeof result.atsScore !== 'undefined' && (
                <motion.div
                  className='flex-1 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 rounded-2xl shadow-2xl border-4 border-emerald-400 p-8 backdrop-blur-sm flex flex-col items-center justify-center min-w-[220px]'
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                >
                  <div className='flex items-center mb-3'>
                    <div className='w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg'>
                      <svg
                        className='w-7 h-7 text-white drop-shadow-lg'
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
                    <h3 className='font-bold text-2xl text-emerald-100 drop-shadow'>
                      ATS Score
                    </h3>
                  </div>
                  <div className='text-6xl font-mono font-extrabold text-emerald-200 drop-shadow-lg text-center mb-2'>
                    {result?.atsScore ?? '--'}/100
                  </div>
                  <div className='text-sm text-emerald-200 font-semibold text-center'>
                    Resume compatibility with ATS
                  </div>
                </motion.div>
              )}
            </div>
            {/* Pros Card */}
            {result?.pros && (
              <motion.div
                className='bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-2xl border border-slate-600 p-8 backdrop-blur-sm'
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
                  <h3 className='font-bold text-2xl text-white'>Pros</h3>
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
                  {result?.pros ?? ''}
                </ReactMarkdown>
              </motion.div>
            )}
            {/* Cons Card */}
            {result?.cons && (
              <motion.div
                className='bg-gradient-to-br from-red-900 via-red-800 to-pink-800 rounded-2xl shadow-2xl border border-red-600 p-8 backdrop-blur-sm'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
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
                  {result?.cons ?? ''}
                </ReactMarkdown>
              </motion.div>
            )}
            {/* Job Match & Improvements Card */}
            {result?.jobMatch && (
              <motion.div
                className='bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-800 rounded-2xl shadow-2xl border border-amber-600 p-8 backdrop-blur-sm'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
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
                    Job Match
                  </h3>
                </div>
                <div className='text-4xl font-mono font-bold text-amber-200 mb-4'>
                  {result?.jobMatch}/100
                </div>
                <h4 className='font-semibold text-amber-100 mb-3'>
                  How to Improve:
                </h4>
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
                  {result?.jobImprovements ?? ''}
                </ReactMarkdown>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
