'use client'

import axios from 'axios'
import React, { useEffect, useReducer, useState } from 'react'
import { generateLatexFromState } from '@/components/coverLetterPreview'
import { motion, AnimatePresence } from 'framer-motion'

const initialState = {
  name: '',
  email: '',
  phone: '',
  linkedin: '',
  city: '',
  date: '',
  prompt: '',
  address: [{ role: '', company: '', address1: '', address2: '' }],
  content: ''
}

function coverLetterReducer (state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.payload }

    case 'SET_ADDRESS_FIELD':
      const newAddress = [...state.address]
      newAddress[action.index][action.field] = action.payload
      return { ...state, address: newAddress }

    case 'SET_CONTENT':
      return { ...state, content: action.payload }

    default:
      return state
  }
}

const Page = () => {
  const [state, dispatch] = useReducer(coverLetterReducer, initialState)
  const [pdfUrl, setPdfUrl] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async e => {
    e.preventDefault()
    try {
      if (state.prompt.trim() === '') {
        alert('Fill in the prompt!')
        return
      }

      setLoading(true)
      const response = await axios.post('/api/generate', {
        prompt: state.prompt
      })

      dispatch({
        type: 'SET_CONTENT',
        payload: response.data.result
      })

      console.log(state.content)
    } catch (error) {
      console.error('Error: ', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const latex = generateLatexFromState(state)

      console.log(latex)

      const res = await fetch(
        'https://latex-compiler-backend-production-3063.up.railway.app/compile',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: latex, compiler: 'pdflatex' })
        }
      )

      if (!res.ok || res.headers.get('Content-Type') !== 'application/pdf') {
        const err = await res.text()
        console.error('LaTeX Compile Error:\n', err)
        alert('LaTeX error! Check console for details.')
        return
      }

      const blob = await res.blob()
      const genPdfUrl = URL.createObjectURL(blob)
      setPdfUrl(genPdfUrl)

      // Open PDF in new tab/window
      window.open(genPdfUrl, '_blank')
    } catch (error) {
      console.error('Error: ', error.message)
    }
  }

  const handleChange = e => {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name,
      payload: e.target.value
    })
  }

  const handleAddressChange = (e, index) => {
    dispatch({
      type: 'SET_ADDRESS_FIELD',
      index,
      field: e.target.name,
      payload: e.target.value
    })
  }

  return (
    <div className='min-h-screen bg-gray-300 p-6'>
      <div className='flex h-full bg-white shadow-2xl overflow-hidden'>
        <div className='w-1/2 p-10 space-y-8 bg-[#2a2a2a] overflow-y-auto max-h-screen'>
          <h1 className='text-4xl font-bold text-white font-mono'>
            Create Your Cover Letter
          </h1>
          <p className='text-gray-300 text-lg'>
            Build a compelling cover letter that gets you noticed
          </p>

          <AnimatePresence mode='wait'>
            {step === 1 && (
              <motion.div
                key='step1'
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className='space-y-8'
              >
                <div className='space-y-6'>
                  <div className='flex items-center space-x-3 mb-8'>
                    <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                      1
                    </div>
                    <h2 className='text-2xl font-semibold text-white font-mono'>
                      Personal Details
                    </h2>
                  </div>

                  {['name', 'email', 'phone', 'linkedin', 'city', 'date'].map(
                    field => (
                      <motion.div
                        key={field}
                        className='flex flex-col'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay:
                            0.1 *
                            [
                              'name',
                              'email',
                              'phone',
                              'linkedin',
                              'city',
                              'date'
                            ].indexOf(field)
                        }}
                      >
                        <label className='text-sm font-medium text-gray-300 mb-2 font-mono'>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          name={field}
                          value={state[field]}
                          onChange={handleChange}
                          className='bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                          placeholder={`Enter your ${field}`}
                        />
                      </motion.div>
                    )
                  )}

                  <motion.div
                    className='flex justify-end pt-6'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <button
                      onClick={() => setStep(2)}
                      className='bg-[#00f5a0] text-black px-8 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105'
                    >
                      Next →
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key='step2'
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className='space-y-8'
              >
                <div className='flex items-center space-x-3 mb-8'>
                  <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                    2
                  </div>
                  <h2 className='text-2xl font-semibold text-white font-mono'>
                    Recipient Address Details
                  </h2>
                </div>

                <div className='space-y-6'>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-white font-mono'>
                      Recipient Address
                    </h3>
                    {state.address.map((addr, idx) => (
                      <motion.div
                        key={idx}
                        className='border border-gray-600 p-6 rounded-xl shadow-lg bg-[#3a3a3a] space-y-4'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className='grid grid-cols-2 gap-4'>
                          <input
                            name='role'
                            value={addr.role}
                            onChange={e => handleAddressChange(e, idx)}
                            placeholder='Job Title'
                            className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                          />
                          <input
                            name='company'
                            value={addr.company}
                            onChange={e => handleAddressChange(e, idx)}
                            placeholder='Company Name'
                            className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                          />
                        </div>
                        <input
                          name='address1'
                          value={addr.address1}
                          onChange={e => handleAddressChange(e, idx)}
                          placeholder='Address Line 1'
                          className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full'
                        />
                        <input
                          name='address2'
                          value={addr.address2}
                          onChange={e => handleAddressChange(e, idx)}
                          placeholder='Address Line 2'
                          className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full'
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className='mt-8 flex gap-4'>
                  <motion.button
                    onClick={() => setStep(1)}
                    className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mono font-bold'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    onClick={() => setStep(3)}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key='step3'
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className='space-y-8'
              >
                <div className='flex items-center space-x-3 mb-8'>
                  <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                    3
                  </div>
                  <h2 className='text-2xl font-semibold text-white font-mono'>
                    Generate Content & Review
                  </h2>
                </div>

                <div className='space-y-6'>
                  <div className='bg-[#3a3a3a] p-6 rounded-xl border border-gray-600'>
                    <h3 className='text-white font-mono text-lg mb-4'>
                      Job Description Prompt
                    </h3>
                    <label className='text-sm font-medium text-gray-300 mb-2 font-mono'>
                      Describe the job and your qualifications
                    </label>
                    <textarea
                      name='prompt'
                      value={state.prompt}
                      onChange={handleChange}
                      placeholder='Describe the job, your qualifications, and what you want to highlight...'
                      className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full h-32 resize-none mb-4'
                    />
                    <motion.button
                      onClick={handleGenerate}
                      disabled={loading}
                      className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? 'Generating...' : '✨ Generate Content'}
                    </motion.button>
                  </div>

                  {state.content && (
                    <div className='bg-[#3a3a3a] p-6 rounded-xl border border-gray-600'>
                      <h3 className='text-white font-mono text-lg mb-4'>
                        Generated Content
                      </h3>
                      <textarea
                        name='content'
                        value={state.content}
                        onChange={e =>
                          dispatch({
                            type: 'SET_CONTENT',
                            payload: e.target.value
                          })
                        }
                        className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full h-48 resize-none'
                      />
                    </div>
                  )}

                  <div className='flex gap-4'>
                    <motion.button
                      onClick={() => setStep(2)}
                      className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mono font-bold'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!state.content}
                      className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🎯 Generate PDF
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className='w-1/2 p-6 bg-[#1c1c1c]'>
          <div className='flex items-center justify-center h-full'>
            <div className='text-center max-w-md'>
              <div className='w-20 h-20 bg-[#00f5a0] rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-3xl'>✉️</span>
              </div>
              <h2 className='text-3xl font-bold text-white font-mono mb-4'>
                Let's Generate Your Cover Letter
              </h2>
              <p className='text-gray-400 text-lg font-mono leading-relaxed'>
                Create a compelling cover letter that showcases your skills and
                experience. Our AI-powered tool will help you craft the perfect
                introduction to potential employers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
