//ResumeForm component that contains the form to get the user details, convert it to LaTeX and then generate a PDF from it

'use client'

import React, { useEffect, useReducer, useState } from 'react'
import { generateLatexFromState } from '@/components/resumePreview'
import { improvePoints } from '@/components/improvePoints'
import { useSession } from 'next-auth/react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

// Reducer function to handle state updates for the resume form
function resumeReducer (state, action) {
  switch (action.type) {
    case 'SET_NAME':
    case 'SET_EMAIL':
    case 'SET_PHONE':
    case 'SET_GITHUB':
    case 'SET_LINKEDIN':
      return { ...state, [action.field]: action.payload }

    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [
          ...state.education,
          { title: '', date: '', subtitle: '', points: [''] }
        ]
      }
    case 'UPDATE_EDUCATION_FIELD': {
      const updated = [...state.education]
      updated[action.index][action.field] = action.payload
      return { ...state, education: updated }
    }
    case 'UPDATE_EDUCATION_POINT': {
      const updated = [...state.education]
      updated[action.eduIndex].points[action.pointIndex] = action.payload
      return { ...state, education: updated }
    }
    case 'ADD_EDUCATION_POINT': {
      const updated = [...state.education]
      updated[action.eduIndex].points.push('')
      return { ...state, education: updated }
    }
    case 'DELETE_EDUCATION': {
      const updated = state.education.filter((_, i) => i !== action.index)
      return { ...state, education: updated }
    }

    case 'ADD_EXPERIENCE':
      return {
        ...state,
        experience: [
          ...state.experience,
          { title: '', date: '', subtitle: '', points: [''] }
        ]
      }
    case 'UPDATE_EXPERIENCE_FIELD': {
      const updated = [...state.experience]
      updated[action.index][action.field] = action.payload
      return { ...state, experience: updated }
    }
    case 'UPDATE_EXPERIENCE_POINT': {
      const updated = [...state.experience]
      updated[action.expIndex].points[action.pointIndex] = action.payload
      return { ...state, experience: updated }
    }
    case 'ADD_EXPERIENCE_POINT': {
      const updated = [...state.experience]
      updated[action.expIndex].points.push('')
      return { ...state, experience: updated }
    }
    case 'DELETE_EXPERIENCE': {
      const updated = state.experience.filter((_, i) => i !== action.index)
      return { ...state, experience: updated }
    }

    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, { type: '', tools: '' }] }
    case 'UPDATE_SKILL': {
      const updated = [...state.skills]
      updated[action.index][action.field] = action.payload
      return { ...state, skills: updated }
    }
    case 'DELETE_SKILL': {
      const updated = state.skills.filter((_, i) => i !== action.index)
      return { ...state, skills: updated }
    }

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [
          ...state.projects,
          { title: '', date: '', subtitle: '', points: [''] }
        ]
      }
    case 'UPDATE_PROJECT_FIELD': {
      const updated = [...state.projects]
      updated[action.index][action.field] = action.payload
      return { ...state, projects: updated }
    }
    case 'UPDATE_PROJECT_POINT': {
      console.log('UPDATE_PROJECT_POINT', { state, action })
      if (
        !Array.isArray(state.projects) ||
        typeof action.projIndex !== 'number' ||
        action.projIndex < 0 ||
        action.projIndex >= state.projects.length
      ) {
        return state
      }
      const updated = [...state.projects]
      if (!updated[action.projIndex]) {
        return state
      }
      if (!updated[action.projIndex].points) {
        updated[action.projIndex].points = []
      }
      if (typeof action.pointIndex !== 'number' || action.pointIndex < 0) {
        return state
      }
      updated[action.projIndex].points[action.pointIndex] = action.payload
      return { ...state, projects: updated }
    }
    case 'ADD_PROJECT_POINT': {
      console.log('ADD_PROJECT_POINT', { state, action })
      if (
        !Array.isArray(state.projects) ||
        typeof action.projIndex !== 'number' ||
        action.projIndex < 0 ||
        action.projIndex >= state.projects.length
      ) {
        return state
      }
      const updated = [...state.projects]
      if (!updated[action.projIndex]) {
        return state
      }
      if (!updated[action.projIndex].points) {
        updated[action.projIndex].points = []
      }
      updated[action.projIndex].points.push('')
      return { ...state, projects: updated }
    }
    case 'DELETE_PROJECT': {
      const updated = state.projects.filter((_, i) => i !== action.index)
      return { ...state, projects: updated }
    }

    case 'ADD_ACHIEVEMENT':
      return { ...state, achievements: [...state.achievements, ''] }
    case 'UPDATE_ACHIEVEMENT': {
      const updated = [...state.achievements]
      updated[action.index] = action.payload
      return { ...state, achievements: updated }
    }
    case 'DELETE_ACHIEVEMENT': {
      const updated = state.achievements.filter((_, i) => i !== action.index)
      return { ...state, achievements: updated }
    }

    default:
      return state
  }
}

// Initial state for the resume form
const initialState = {
  name: '',
  email: '',
  phone: '',
  github: '',
  linkedin: '',
  education: [{ title: '', date: '', subtitle: '', points: [''] }],
  experience: [{ title: '', date: '', subtitle: '', points: [''] }],
  projects: [{ title: '', date: '', techstack: '', points: [''] }],
  achievements: [''],
  skills: [{ type: '', tools: '' }]
}

export default function ResumeForm ({ initialData = null }) {
  const [state, dispatch] = useReducer(
    resumeReducer,
    initialData || initialState
  )
  const [step, setStep] = useState(1)
  const [pdfUrl, setPdfUrl] = useState('')
  const [latexCode, setLatexCode] = useState('')
  const [improvedPoints, setImprovedPoints] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [aiImprovementType, setAIImprovementType] = useState('')
  const { data: session, status } = useSession()
  const email = session?.user?.email
  if (status === 'authenticated') {
    console.log(email)
  }
  const [loading, setLoading] = useState(false)

  // Experience AI generator
  const [aiExperiencePrompt, setAiExperiencePrompt] = useState('')
  const [aiExperienceResponse, setAiExperienceResponse] = useState('')

  // Skills AI generator
  const [aiSkillsPrompt, setAiSkillsPrompt] = useState('')
  const [aiSkillsResponse, setAiSkillsResponse] = useState('')

  // Project AI generator
  const [aiProjectPrompt, setAiProjectPrompt] = useState('')
  const [aiProjectResponse, setAiProjectResponse] = useState('')

  // Achievements AI generator
  const [aiAchievementPrompt, setAiAchievementPrompt] = useState('')
  const [aiAchievementResponse, setAiAchievementResponse] = useState('')

  //Generating the live resume preview url
  //useEffect doesn't directly support async, so you have to create a function within it
  useEffect(() => {
    try {
      const generatePdfUrl = async () => {
        const latex = generateLatexFromState(state)
        setLatexCode(latex)

        console.log(latex)

        //Calls the backend to compile the LaTeX code into a PDF
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
      }

      generatePdfUrl()
    } catch (error) {
      console.error('Error: ', error.message)
    } finally {
      setTimeout(() => setLoading(false), 400)
    }
  }, [state])

  // Function to generate points using AI for experience, skills, projects, and achievements
  const handleExperienceAi = async () => {
    if (aiExperiencePrompt == '') {
      console.log('No prompt entered!')
      return
    }

    const res = await fetch('/api/ai-experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: aiExperiencePrompt
      })
    })

    const text = await res.json()

    console.log(text.result)
    setAiExperienceResponse(text.result)
  }

  const handleSkillsAi = async () => {
    if (aiSkillsPrompt == '') {
      console.log('No prompt entered!')
      return
    }

    const res = await fetch('/api/ai-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: aiSkillsPrompt
      })
    })

    const text = await res.json()

    console.log(text.result)
    setAiSkillsResponse(text.result)
  }

  const handleProjectAi = async () => {
    if (aiProjectPrompt == '') {
      console.log('No prompt entered!')
      return
    }
    const res = await fetch('/api/ai-projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: aiProjectPrompt })
    })
    const text = await res.json()
    setAiProjectResponse(text.result)
  }

  const handleAchievementAi = async () => {
    if (aiAchievementPrompt == '') {
      console.log('No prompt entered!')
      return
    }
    const res = await fetch('/api/ai-achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: aiAchievementPrompt })
    })
    const text = await res.json()
    setAiAchievementResponse(text.result)
  }

  //Function to save the resume in the database if the user is authenticated
  const handleSave = async () => {
    if (status !== 'authenticated' || !email) {
      alert('You must be signed in to save your resume.')
      return
    }

    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latexCode,
        userId: email,
        data: state,
        name: state.name
      })
    })

    const contentType = res.headers.get('content-type')
    if (!res.ok || !contentType?.includes('application/json')) {
      const text = await res.text()
      console.error('Unexpected response:', text)
      return
    }

    const data = await res.json()
    if (data.success) {
      console.log('Resume saved successfully:', data.resume)
    } else {
      console.log('Failed to save resume:', data.error)
    }
  }

  // Function to handle AI improvement of points in a section (experience, projects)
  const handleAIImprove = async type => {
    try {
      const section = state[type] // state.projects or state.experience

      const originalPoints = []
      const indexMap = [] // To keep track of which point belongs to which section

      section.forEach((entry, sectionIndex) => {
        entry.points.forEach((point, pointIndex) => {
          originalPoints.push(point)
          indexMap.push({ sectionIndex, pointIndex })
        })
      })

      const improved = await improvePoints(type, originalPoints)

      setImprovedPoints(
        improved.map((text, i) => ({
          ...indexMap[i],
          text
        }))
      )

      setAIImprovementType(type)
      setShowModal(true)
    } catch (error) {
      console.log('Error:', error)
    }
  }

  //Function to render input fields for points in a section
  const renderPointInputs = (points, sectionType, sectionIndex) =>
    (Array.isArray(points) ? points : []).map((point, i) => (
      <input
        key={i}
        className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full my-2'
        placeholder={`Description ${i + 1}`}
        value={point}
        onChange={e =>
          dispatch({
            type:
              sectionType === 'education'
                ? 'UPDATE_EDUCATION_POINT'
                : sectionType === 'experience'
                ? 'UPDATE_EXPERIENCE_POINT'
                : 'UPDATE_PROJECT_POINT',
            eduIndex: sectionType === 'education' ? sectionIndex : undefined,
            expIndex: sectionType === 'experience' ? sectionIndex : undefined,
            projIndex: sectionType === 'projects' ? sectionIndex : undefined,
            pointIndex: i,
            payload: e.target.value
          })
        }
      />
    ))

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a]'>
      <div className='w-full md:w-1/2 p-10 space-y-8 bg-[#2a2a2a] shadow-2xl border-r border-gray-700'>
        <h1 className='text-4xl font-bold text-white font-mono'>
          Create Your Resume
        </h1>
        <p className='text-gray-300 text-lg'>
          Build a professional resume that stands out
        </p>
        {/* Left Side - Form Steps */}
        <AnimatePresence mode='wait'>
          {/* Personal Details */}
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

                {['name', 'email', 'phone', 'github', 'linkedin'].map(field => (
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
                          'github',
                          'linkedin'
                        ].indexOf(field)
                    }}
                  >
                    <label className='text-sm font-medium text-gray-300 mb-2 font-mono'>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      className='bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                      placeholder={`Enter your ${field}`}
                      value={state[field]}
                      onChange={e =>
                        dispatch({
                          type: `SET_${field.toUpperCase()}`,
                          field,
                          payload: e.target.value
                        })
                      }
                    />
                  </motion.div>
                ))}

                {/* Framer Motion animation for the button */}
                <motion.div
                  className='flex justify-end pt-6'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
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

          {/* Education Details */}
          {step === 2 && (
            <motion.div
              key='step2'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className='space-y-8'
            >
              <>
                <div className='flex items-center space-x-3 mb-8'>
                  <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                    2
                  </div>
                  <h2 className='text-2xl font-semibold text-white font-mono'>
                    Education
                  </h2>
                </div>
                {state.education.map((edu, idx) => (
                  <motion.div
                    key={idx}
                    className='border border-gray-600 p-6 my-6 rounded-xl shadow-lg bg-[#3a3a3a] space-y-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className='grid grid-cols-2 gap-4'>
                      <input
                        className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                        placeholder='Degree/Title'
                        value={edu.title}
                        onChange={e =>
                          dispatch({
                            type: 'UPDATE_EDUCATION_FIELD',
                            index: idx,
                            field: 'title',
                            payload: e.target.value
                          })
                        }
                      />
                      <input
                        className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                        placeholder='Date'
                        value={edu.date}
                        onChange={e =>
                          dispatch({
                            type: 'UPDATE_EDUCATION_FIELD',
                            index: idx,
                            field: 'date',
                            payload: e.target.value
                          })
                        }
                      />
                    </div>
                    <input
                      className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                      placeholder='Institution'
                      value={edu.subtitle}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_EDUCATION_FIELD',
                          index: idx,
                          field: 'subtitle',
                          payload: e.target.value
                        })
                      }
                    />
                    {renderPointInputs(edu.points, 'education', idx)}
                    <div className='flex justify-between items-center pt-2'>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'ADD_EDUCATION_POINT',
                            eduIndex: idx
                          })
                        }
                        className='text-[#00f5a0] text-sm hover:text-[#00d488] font-mono transition-colors duration-200'
                      >
                        + Add Point
                      </button>
                      {state.education.length > 1 && (
                        <button
                          onClick={() =>
                            dispatch({ type: 'DELETE_EDUCATION', index: idx })
                          }
                          className='text-red-400 text-sm hover:text-red-300 font-mono transition-colors duration-200'
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                <motion.button
                  onClick={() => dispatch({ type: 'ADD_EDUCATION' })}
                  className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Add Education
                </motion.button>
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
              </>
            </motion.div>
          )}

          {/* Experience Details */}
          {step === 3 && (
            <motion.div
              key='step3'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className='space-y-8'
            >
              <>
                <div className='flex items-center space-x-3 mb-8'>
                  <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                    3
                  </div>
                  <h2 className='text-2xl font-semibold text-white font-mono'>
                    Experience
                  </h2>
                </div>
                {state.experience.map((exp, idx) => (
                  <motion.div
                    key={idx}
                    className='border border-gray-600 p-6 my-6 rounded-xl shadow-lg bg-[#3a3a3a] space-y-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className='grid grid-cols-2 gap-4'>
                      <input
                        className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                        placeholder='Job Title'
                        value={exp.title}
                        onChange={e =>
                          dispatch({
                            type: 'UPDATE_EXPERIENCE_FIELD',
                            index: idx,
                            field: 'title',
                            payload: e.target.value
                          })
                        }
                      />
                      <input
                        className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                        placeholder='Date'
                        value={exp.date}
                        onChange={e =>
                          dispatch({
                            type: 'UPDATE_EXPERIENCE_FIELD',
                            index: idx,
                            field: 'date',
                            payload: e.target.value
                          })
                        }
                      />
                    </div>
                    <input
                      className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                      placeholder='Company'
                      value={exp.subtitle}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_EXPERIENCE_FIELD',
                          index: idx,
                          field: 'subtitle',
                          payload: e.target.value
                        })
                      }
                    />
                    {renderPointInputs(exp.points, 'experience', idx)}
                    <div className='flex justify-between items-center pt-2'>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'ADD_EXPERIENCE_POINT',
                            expIndex: idx
                          })
                        }
                        className='text-[#00f5a0] text-sm hover:text-[#00d488] font-mono transition-colors duration-200'
                      >
                        + Add Point
                      </button>
                      {state.experience.length > 1 && (
                        <button
                          onClick={() =>
                            dispatch({ type: 'DELETE_EXPERIENCE', index: idx })
                          }
                          className='text-red-400 text-sm hover:text-red-300 font-mono transition-colors duration-200'
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <motion.button
                      onClick={() => {
                        setAIImprovementType('experience')
                        handleAIImprove('experience')
                      }}
                      className='bg-[#00f5a0] text-black px-4 py-2 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold text-sm'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✨ Improve with AI
                    </motion.button>
                  </motion.div>
                ))}
                <motion.button
                  onClick={() => dispatch({ type: 'ADD_EXPERIENCE' })}
                  className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Add Experience
                </motion.button>

                <div className='mt-6 p-6 bg-[#3a3a3a] rounded-xl border border-gray-600'>
                  <h3 className='text-white font-mono text-lg mb-4'>
                    AI Experience Generator
                  </h3>
                  <textarea
                    onChange={e => setAiExperiencePrompt(e.target.value)}
                    className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full h-24 resize-none'
                    placeholder='Describe your role and responsibilities...'
                  />
                  {aiExperienceResponse && (
                    <div className='mt-4 p-4 bg-[#232323] rounded-lg border border-gray-600'>
                      <div className='space-y-4'>
                        {aiExperienceResponse
                          .split(/\n(?=[^\n])/)
                          .map((section, idx) => (
                            <div key={idx} className='mb-2'>
                              {section
                                .split(/\n/)
                                .filter(line => line.trim() !== '')
                                .map((line, i) => (
                                  <div
                                    key={i}
                                    className={
                                      line.trim().startsWith('•') ||
                                      line.trim().startsWith('-')
                                        ? 'pl-4 text-[#00f5a0] font-mono'
                                        : 'font-bold text-gray-100 font-mono mt-2'
                                    }
                                  >
                                    {line}
                                  </div>
                                ))}
                              {idx !==
                                aiExperienceResponse.split(/\n(?=[^\n])/)
                                  .length -
                                  1 && <hr className='my-3 border-gray-700' />}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  <motion.button
                    onClick={handleExperienceAi}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold mt-4'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Generate Experience
                  </motion.button>
                </div>

                <div className='mt-8 flex gap-4'>
                  <motion.button
                    onClick={() => setStep(2)}
                    className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mono font-bold'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    onClick={() => setStep(4)}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next →
                  </motion.button>
                </div>
              </>
            </motion.div>
          )}

          {/* Skills Details */}
          {step === 4 && (
            <motion.div
              key='step4'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className='space-y-8'
            >
              <>
                <div className='flex items-center space-x-3 mb-8'>
                  <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                    4
                  </div>
                  <h2 className='text-2xl font-semibold text-white font-mono'>
                    Projects
                  </h2>
                </div>
                {state.projects.map((proj, idx) => (
                  <motion.div
                    key={idx}
                    className='border border-gray-600 p-6 my-6 rounded-xl shadow-lg bg-[#3a3a3a] space-y-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className='grid grid-cols-2 gap-4'>
                      <input
                        className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                        placeholder='Project Title'
                        value={proj.title}
                        onChange={e =>
                          dispatch({
                            type: 'UPDATE_PROJECT_FIELD',
                            index: idx,
                            field: 'title',
                            payload: e.target.value
                          })
                        }
                      />
                      <input
                        className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                        placeholder='Date'
                        value={proj.date}
                        onChange={e =>
                          dispatch({
                            type: 'UPDATE_PROJECT_FIELD',
                            index: idx,
                            field: 'date',
                            payload: e.target.value
                          })
                        }
                      />
                    </div>
                    <input
                      className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200'
                      placeholder='Technologies Used'
                      value={proj.subtitle}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_PROJECT_FIELD',
                          index: idx,
                          field: 'subtitle',
                          payload: e.target.value
                        })
                      }
                    />
                    {renderPointInputs(proj.points, 'projects', idx)}
                    <div className='flex justify-between items-center pt-2'>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'ADD_PROJECT_POINT',
                            projIndex: idx
                          })
                        }
                        className='text-[#00f5a0] text-sm hover:text-[#00d488] font-mono transition-colors duration-200'
                      >
                        + Add Point
                      </button>
                      {state.projects.length > 1 && (
                        <button
                          onClick={() =>
                            dispatch({ type: 'DELETE_PROJECT', index: idx })
                          }
                          className='text-red-400 text-sm hover:text-red-300 font-mono transition-colors duration-200'
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                <motion.button
                  onClick={() => dispatch({ type: 'ADD_PROJECT' })}
                  className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Add Project
                </motion.button>
                <div className='mt-6 p-6 bg-[#3a3a3a] rounded-xl border border-gray-600'>
                  <h3 className='text-white font-mono text-lg mb-4'>
                    AI Project Generator
                  </h3>
                  <textarea
                    onChange={e => setAiProjectPrompt(e.target.value)}
                    className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full h-24 resize-none'
                    placeholder='Describe your project, technologies, and impact...'
                  />
                  {aiProjectResponse && (
                    <div className='mt-4 p-4 bg-[#232323] rounded-lg border border-gray-600'>
                      <div className='space-y-4'>
                        {aiProjectResponse
                          .split(/\n(?=[^\n])/)
                          .map((section, idx) => (
                            <div key={idx} className='mb-2'>
                              {section
                                .split(/\n/)
                                .filter(line => line.trim() !== '')
                                .map((line, i) => (
                                  <div
                                    key={i}
                                    className={
                                      line.trim().startsWith('•') ||
                                      line.trim().startsWith('-')
                                        ? 'pl-4 text-[#00f5a0] font-mono'
                                        : 'font-bold text-gray-100 font-mono mt-2'
                                    }
                                  >
                                    {line}
                                  </div>
                                ))}
                              {idx !==
                                aiProjectResponse.split(/\n(?=[^\n])/).length -
                                  1 && <hr className='my-3 border-gray-700' />}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  <motion.button
                    onClick={handleProjectAi}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold mt-4'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Generate Project
                  </motion.button>
                </div>
                <div className='mt-8 flex gap-4'>
                  <motion.button
                    onClick={() => setStep(3)}
                    className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mono font-bold'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    onClick={() => setStep(5)}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next →
                  </motion.button>
                </div>
              </>
            </motion.div>
          )}

          {/* Achievements Details */}
          {step === 5 && (
            <motion.div
              key='step5'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className='space-y-8'
            >
              <>
                <div className='flex items-center space-x-3 mb-8'>
                  <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                    5
                  </div>
                  <h2 className='text-2xl font-semibold text-white font-mono'>
                    Achievements
                  </h2>
                </div>
                {state.achievements.map((achievement, idx) => (
                  <motion.div
                    key={idx}
                    className='border border-gray-600 p-4 my-4 rounded-xl shadow-lg bg-[#3a3a3a]'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <input
                      className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full'
                      placeholder='Describe your achievement...'
                      value={achievement}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_ACHIEVEMENT',
                          index: idx,
                          payload: e.target.value
                        })
                      }
                    />
                    {state.achievements.length > 1 && (
                      <button
                        onClick={() =>
                          dispatch({ type: 'DELETE_ACHIEVEMENT', index: idx })
                        }
                        className='text-red-400 text-sm hover:text-red-300 font-mono transition-colors duration-200 mt-2'
                      >
                        Delete
                      </button>
                    )}
                  </motion.div>
                ))}
                <motion.button
                  onClick={() => dispatch({ type: 'ADD_ACHIEVEMENT' })}
                  className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Add Achievement
                </motion.button>
                <div className='mt-6 p-6 bg-[#3a3a3a] rounded-xl border border-gray-600'>
                  <h3 className='text-white font-mono text-lg mb-4'>
                    AI Achievements Generator
                  </h3>
                  <textarea
                    onChange={e => setAiAchievementPrompt(e.target.value)}
                    className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full h-24 resize-none'
                    placeholder='Describe your achievement, award, or recognition...'
                  />
                  {aiAchievementResponse && (
                    <div className='mt-4 p-4 bg-[#232323] rounded-lg border border-gray-600'>
                      <div className='space-y-4'>
                        {aiAchievementResponse
                          .split(/\n(?=[^\n])/)
                          .map((section, idx) => (
                            <div key={idx} className='mb-2'>
                              {section
                                .split(/\n/)
                                .filter(line => line.trim() !== '')
                                .map((line, i) => (
                                  <div
                                    key={i}
                                    className={
                                      line.trim().startsWith('•') ||
                                      line.trim().startsWith('-')
                                        ? 'pl-4 text-[#00f5a0] font-mono'
                                        : 'font-bold text-gray-100 font-mono mt-2'
                                    }
                                  >
                                    {line}
                                  </div>
                                ))}
                              {idx !==
                                aiAchievementResponse.split(/\n(?=[^\n])/)
                                  .length -
                                  1 && <hr className='my-3 border-gray-700' />}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  <motion.button
                    onClick={handleAchievementAi}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold mt-4'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Generate Achievement
                  </motion.button>
                </div>
                <div className='mt-8 flex gap-4'>
                  <motion.button
                    onClick={() => setStep(4)}
                    className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mono font-bold'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    onClick={() => setStep(6)}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next →
                  </motion.button>
                </div>
              </>
            </motion.div>
          )}

          {/* Skills Details */}
          {step === 6 && (
            <motion.div
              key='step6'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className='space-y-8'
            >
              <>
                <div className='flex items-center space-x-3 mb-8'>
                  <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                    6
                  </div>
                  <h2 className='text-2xl font-semibold text-white font-mono'>
                    Skills
                  </h2>
                </div>
                {state.skills.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    className='flex gap-4 mb-4 p-4 bg-[#3a3a3a] rounded-xl border border-gray-600'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <input
                      className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-1/2'
                      placeholder='Skill Type (e.g., Programming)'
                      value={skill.type}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_SKILL',
                          index: idx,
                          field: 'type',
                          payload: e.target.value
                        })
                      }
                    />
                    <input
                      className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-1/2'
                      placeholder='Tools/Technologies'
                      value={skill.tools}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_SKILL',
                          index: idx,
                          field: 'tools',
                          payload: e.target.value
                        })
                      }
                    />
                    {state.skills.length > 1 && (
                      <button
                        onClick={() =>
                          dispatch({ type: 'DELETE_SKILL', index: idx })
                        }
                        className='text-red-400 text-sm hover:text-red-300 font-mono transition-colors duration-200'
                      >
                        Delete
                      </button>
                    )}
                  </motion.div>
                ))}
                <motion.button
                  onClick={() => dispatch({ type: 'ADD_SKILL' })}
                  className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Add Skill
                </motion.button>
                <div className='mt-6 p-6 bg-[#3a3a3a] rounded-xl border border-gray-600'>
                  <h3 className='text-white font-mono text-lg mb-4'>
                    AI Skills Generator
                  </h3>
                  <textarea
                    onChange={e => setAiSkillsPrompt(e.target.value)}
                    className='bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00f5a0] focus:border-[#00f5a0] focus:outline-none text-white placeholder-gray-400 transition-all duration-200 w-full h-24 resize-none'
                    placeholder='Describe your skills and experience...'
                  />
                  {aiSkillsResponse && (
                    <div className='mt-4 p-4 bg-[#232323] rounded-lg border border-gray-600'>
                      <div className='space-y-4'>
                        {aiSkillsResponse
                          .split(/\n(?=[^\n])/)
                          .map((section, idx) => (
                            <div key={idx} className='mb-2'>
                              {section
                                .split(/\n/)
                                .filter(line => line.trim() !== '')
                                .map((line, i) => (
                                  <div
                                    key={i}
                                    className={
                                      line.trim().startsWith('•') ||
                                      line.trim().startsWith('-')
                                        ? 'pl-4 text-[#00f5a0] font-mono'
                                        : 'font-bold text-gray-100 font-mono mt-2'
                                    }
                                  >
                                    {line}
                                  </div>
                                ))}
                              {idx !==
                                aiSkillsResponse.split(/\n(?=[^\n])/).length -
                                  1 && <hr className='my-3 border-gray-700' />}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  <motion.button
                    onClick={handleSkillsAi}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold mt-4'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Generate Skills
                  </motion.button>
                </div>
                <div className='mt-8 flex gap-4'>
                  <motion.button
                    onClick={() => setStep(5)}
                    className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mono font-bold'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    onClick={() => setStep(7)}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next →
                  </motion.button>
                </div>
              </>
            </motion.div>
          )}

          {/* Preview and Save */}
          {step === 7 && (
            <motion.div
              key='step7'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className='space-y-8'
            >
              <>
                <div className='flex items-center space-x-3 mb-8'>
                  <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                    7
                  </div>
                  <h2 className='text-2xl font-semibold text-white font-mono'>
                    Preview & Save
                  </h2>
                </div>

                <div className='p-6 bg-[#3a3a3a] rounded-xl border border-gray-600'>
                  <h3 className='text-white font-mono text-lg mb-4'>
                    Resume Summary
                  </h3>
                  <div className='space-y-3 text-gray-300'>
                    <p>
                      <span className='text-[#00f5a0] font-bold'>Name:</span>{' '}
                      {state.name || 'Not provided'}
                    </p>
                    <p>
                      <span className='text-[#00f5a0] font-bold'>Email:</span>{' '}
                      {state.email || 'Not provided'}
                    </p>
                    <p>
                      <span className='text-[#00f5a0] font-bold'>
                        Education:
                      </span>{' '}
                      {state.education.length} entries
                    </p>
                    <p>
                      <span className='text-[#00f5a0] font-bold'>
                        Experience:
                      </span>{' '}
                      {state.experience.length} entries
                    </p>
                    <p>
                      <span className='text-[#00f5a0] font-bold'>
                        Projects:
                      </span>{' '}
                      {state.projects.length} entries
                    </p>
                    <p>
                      <span className='text-[#00f5a0] font-bold'>Skills:</span>{' '}
                      {state.skills.length} categories
                    </p>
                    <p>
                      <span className='text-[#00f5a0] font-bold'>
                        Achievements:
                      </span>{' '}
                      {state.achievements.length} entries
                    </p>
                  </div>
                </div>

                <div className='mt-8 flex gap-4'>
                  <motion.button
                    onClick={() => setStep(6)}
                    className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mono font-bold'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      console.log('Resume Data:', state)
                      alert('Resume generated! Check console for data')
                    }}
                    className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🎯 Generate Resume
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    className='bg-[#00f5a0] text-black px-6 py-3 rounded-lg hover:bg-[#00d488] transition-all duration-300 font-mono font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💾 Save Resume
                  </motion.button>
                </div>
              </>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Side - Generating PDF */}
      <div className='w-full md:w-1/2 p-6 bg-[#1c1c1c]'>
        <div className='sticky top-6'>
          {loading ? (
            <div className='w-full h-[90vh] flex items-center justify-center'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[#00f5a0] mx-auto mb-4'></div>
                <div className='text-[#00f5a0] text-xl font-mono font-bold animate-pulse'>
                  Generating PDF...
                </div>
              </div>
            </div>
          ) : (
            state !== initialState &&
            pdfUrl && (
              <div className='mb-4'>
                {/* Desktop: Show Live Preview text and iframe */}
                <div className='hidden md:block'>
                  <div className='bg-[#2a2a2a] p-4 rounded-xl border border-gray-600 mb-4'>
                    <h3 className='text-white font-mono text-lg mb-2'>
                      Live Preview
                    </h3>
                    <p className='text-gray-400 text-sm'>
                      Your resume updates in real-time
                    </p>
                  </div>
                  <div className='bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 min-h-[200px] flex items-center justify-center'>
                    {pdfUrl ? (
                      <iframe
                        src={pdfUrl}
                        className='w-full h-[85vh]'
                        title='PDF Preview'
                        type='application/pdf'
                      />
                    ) : (
                      <div className='text-gray-400 text-center font-mono p-8'>
                        PDF preview is not available. Please generate your
                        resume to see the live preview.
                      </div>
                    )}
                  </div>
                </div>
                {/* Mobile: Show only a button/link to open PDF if available */}
                <div className='block md:hidden'>
                  {pdfUrl ? (
                    <a
                      href={pdfUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='w-full block text-center bg-[#00f5a0] text-black font-bold font-mono rounded-lg py-4 px-6 shadow-lg hover:bg-[#00d488] transition-all duration-300'
                    >
                      Open PDF Resume Preview
                    </a>
                  ) : (
                    <div className='text-gray-400 text-center font-mono p-8'>
                      PDF preview is not available. Please generate your resume
                      to see the preview.
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* Modal for AI Suggestions */}
        {showModal && (
          <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm'>
            <motion.div
              className='bg-[#2a2a2a] p-8 rounded-2xl w-[700px] max-h-[85vh] overflow-y-auto border border-gray-600 shadow-2xl'
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex items-center space-x-3 mb-6'>
                <div className='w-8 h-8 bg-[#00f5a0] rounded-full flex items-center justify-center text-black font-bold'>
                  ✨
                </div>
                <h2 className='text-2xl font-bold text-white font-mono'>
                  AI Suggestions
                </h2>
              </div>
              <div className='space-y-6'>
                {improvedPoints.map((point, idx) => (
                  <motion.div
                    key={idx}
                    className='p-4 bg-[#3a3a3a] rounded-xl border border-gray-600'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <p className='text-sm text-gray-400 font-mono mb-3'>
                      {aiImprovementType === 'projects'
                        ? 'Project'
                        : 'Experience'}{' '}
                      {point.sectionIndex + 1}, Point {point.pointIndex + 1}
                    </p>
                    <div className='space-y-2'>
                      <p className='text-gray-400 line-through text-sm'>
                        {state[aiImprovementType]?.[point.sectionIndex]
                          ?.points?.[point.pointIndex] ??
                          '[Original point not found]'}
                      </p>
                      <p className='text-[#00f5a0] font-semibold'>
                        {point.text}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => {
                        dispatch({
                          type:
                            aiImprovementType === 'experience'
                              ? 'UPDATE_EXPERIENCE_POINT'
                              : 'UPDATE_PROJECT_POINT',
                          projIndex:
                            aiImprovementType === 'projects'
                              ? point.sectionIndex
                              : undefined,
                          expIndex:
                            aiImprovementType === 'experience'
                              ? point.sectionIndex
                              : undefined,
                          pointIndex: point.pointIndex,
                          payload: point.text
                        })
                      }}
                      className='text-[#00f5a0] text-sm mt-3 font-mono hover:text-[#00d488] transition-colors duration-200'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✅ Apply this suggestion
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => setShowModal(false)}
                className='mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-mono font-bold transition-all duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
