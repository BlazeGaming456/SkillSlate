'use client'

import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

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

      // console.log(text)

      const review = await axios.post(
        '/api/improve',
        { prompt: text, jobDetails: jobDetails, extraJD: extraJD },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )

      setResult(review.data.result)

      // console.log(review.data.result)
    } catch (err) {
      console.error('Upload error:', err)
      const message = err?.response?.data?.error || 'Upload failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto p-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block mb-2 font-medium'>Upload PDF Resume</label>
          <input
            type='file'
            accept='.pdf'
            onChange={e => setFile(e.target.files[0])}
            className='block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100'
          />
        </div>

        <button
          type='submit'
          disabled={!file || isLoading}
          className='w-full px-4 py-2 bg-blue-600 text-white rounded-md
            hover:bg-blue-700 disabled:bg-gray-400'
        >
          {isLoading ? 'Processing...' : 'Analyze PDF'}
        </button>
      </form>

      {error && (
        <div className='mt-4 p-3 bg-red-50 text-red-700 rounded-md'>
          {error}
        </div>
      )}

      <div className='flex flex-col items-center'>
        <textarea name='url' onChange={e => setUrl(e.target.value)}></textarea>
        <button
          className='w-fit p-3 rounded-sm bg-green-400 hover:bg-green-500 hover:cursor-pointer'
          onClick={handleUrl}
        >
          Get Job Details
        </button>
      </div>
      <div>
        <textarea
          name='job details'
          onChange={e => setJobDetails(e.target.value)}
        ></textarea>
      </div>

      {result && (
        <div className='mt-6 space-y-4'>
          <div className='p-4 bg-green-50 rounded-md'>
            <h3 className='font-bold'>Analysis Successful</h3>
            <p>Pages: {result.pages}</p>
          </div>
          <div className='p-4 bg-gray-50 rounded-md'>
            <h3 className='font-bold mb-2'>Extracted Text</h3>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
