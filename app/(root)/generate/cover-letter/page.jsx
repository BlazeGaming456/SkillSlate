'use client'

import axios from 'axios'
import React, { useEffect, useReducer, useState } from 'react'
import { generateLatexFromState } from '@/components/coverLetterPreview'

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

function resumeReducer (state, action) {
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
  const [state, dispatch] = useReducer(resumeReducer, initialState)
  const [pdfUrl, setPdfUrl] = useState('')

  const handleGenerate = async (e) => {
    e.preventDefault()
    try {
      if (state.prompt.trim() === '') {
        alert('Fill in the prompt!')
        return
      }

      const response = await axios.post('http://localhost:3000/api/generate', {
        prompt: state.prompt
      })

      dispatch({
        type: 'SET_CONTENT',
        payload: response.data.result
      })

      console.log(state.content)
    } catch (error) {
      console.error('Error: ', error.message)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const latex = generateLatexFromState(state)

      console.log(latex)

      const res = await fetch(
        'https://latex-compiler-backend-production.up.railway.app/compile',
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

  const downloadPDF = () => {
    alert('PDF Download will be implemented')
  }

  useEffect(() => {
    console.log(pdfUrl);
  },[pdfUrl])

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Resume Form</h1>

      <div className='space-y-4'>
        <input
          name='name'
          value={state.name}
          onChange={handleChange}
          placeholder='Full Name'
          className='border p-2 w-full'
        />
        <input
          name='email'
          value={state.email}
          onChange={handleChange}
          placeholder='Email'
          className='border p-2 w-full'
        />
        <input
          name='phone'
          value={state.phone}
          onChange={handleChange}
          placeholder='Phone'
          className='border p-2 w-full'
        />
        <input
          name='linkedin'
          value={state.linkedin}
          onChange={handleChange}
          placeholder='LinkedIn URL'
          className='border p-2 w-full'
        />
        <input
          name='city'
          value={state.city}
          onChange={handleChange}
          placeholder='City'
          className='border p-2 w-full'
        />
        <input
          name='date'
          value={state.date}
          onChange={handleChange}
          placeholder='Date'
          className='border p-2 w-full'
        />

        <textarea
          name='prompt'
          value={state.prompt}
          onChange={handleChange}
          placeholder='Enter prompt to generate content...'
          className='border p-2 w-full min-h-[100px]'
        />

        <h2 className='text-lg font-semibold mt-6'>Experience Address</h2>
        {state.address.map((addr, idx) => (
          <div key={idx} className='space-y-2'>
            <input
              name='role'
              value={addr.role}
              onChange={e => handleAddressChange(e, idx)}
              placeholder='Role'
              className='border p-2 w-full'
            />
            <input
              name='company'
              value={addr.company}
              onChange={e => handleAddressChange(e, idx)}
              placeholder='Company'
              className='border p-2 w-full'
            />
            <input
              name='address1'
              value={addr.address1}
              onChange={e => handleAddressChange(e, idx)}
              placeholder='Address Line 1'
              className='border p-2 w-full'
            />
            <input
              name='address2'
              value={addr.address2}
              onChange={e => handleAddressChange(e, idx)}
              placeholder='Address Line 2'
              className='border p-2 w-full'
            />
          </div>
        ))}

        <button
          onClick={(e)=>handleGenerate(e)}
          className='bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700'
        >
          Generate Content
        </button>

        {state.content && (
          <div className='mt-6'>
            <h2 className='font-semibold mb-2'>Generated Content:</h2>
            <div className='border p-3 bg-gray-50 whitespace-pre-wrap'>
              <textarea name="content" id="0" className='w-full h-48'>{state.content}</textarea>
            </div>
          </div>
        )}

        <div className='border-2 w-fit p-2 rounded-sm bg-blue-600 text-white hover:bg-blue-700'>
          <button onClick={(e)=>handleSubmit(e)}>
            Generate PDF
          </button>
        </div>

        <div>
          <a href={pdfUrl}>Let's go</a>
        </div>
      </div>
    </div>
  )
}

export default Page