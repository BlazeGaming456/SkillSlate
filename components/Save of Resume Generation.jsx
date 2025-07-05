'use client'

import React, { useEffect, useReducer, useState } from 'react'
import { generateLatexFromState } from '@/components/resumePreview'
import { improvePoints } from '@/components/improvePoints'
import { useSession } from 'next-auth/react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

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

  const [aiExperiencePrompt, setAiExperiencePrompt] = useState('')
  const [aiExperienceResponse, setAiExperienceResponse] = useState('')

  const [aiSkillsPrompt, setAiSkillsPrompt] = useState('')
  const [aiSkillsResponse, setAiSkillsResponse] = useState('')

  //Generating the live resume preview url
  // useEffect doesn't directly support async, so you have to create a function within it
  useEffect(() => {
    try {
      const generatePdfUrl = async () => {
        const latex = generateLatexFromState(state)
        setLatexCode(latex)

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
      }

      generatePdfUrl()
    } catch (error) {
      console.error('Error: ', error.message)
    } finally {
      setTimeout(() => setLoading(false), 400)
    }
  }, [state])

  // const handleGeneratePDF = async () => {
  //   const latex = generateLatexFromState(state)
  //   setLatexCode(latex)

  //   const res = await fetch(
  //     'https://latex-compiler-backend-production.up.railway.app/compile',
  //     {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ code: latex, compiler: 'pdflatex' })
  //     }
  //   )

  //   if (!res.ok || res.headers.get('Content-Type') !== 'application/pdf') {
  //     const err = await res.text()
  //     console.error('LaTeX Compile Error:\n', err)
  //     alert('LaTeX error! Check console for details.')
  //     return
  //   }

  //   const blob = await res.blob()
  //   const genPdfUrl = URL.createObjectURL(blob)
  //   setPdfUrl(genPdfUrl)
  // }

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

    const res = await fetch('/api/ai-Skills', {
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

  const renderPointInputs = (points, sectionType, sectionIndex) =>
    (Array.isArray(points) ? points : []).map((point, i) => (
      <input
        key={i}
        className='border p-2 w-full my-1'
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
    <div className='flex min-h-screen bg-gray-50'>
      <div className='w-1/2 p-10 space-y-8 bg-white shadow-sm'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Create a New Resume
        </h1>
        <AnimatePresence mode='wait'>
          {step === 1 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-700'>
                  Personal Details
                </h2>

                {['name', 'email', 'phone', 'github', 'linkedin'].map(field => (
                  <div key={field} className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-600 mb-1'>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      className='border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
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
                  </div>
                ))}

                <div className='flex justify-end'>
                  <button
                    onClick={() => setStep(2)}
                    className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200'
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <>
                <h2 className='text-xl font-semibold text-gray-700'>
                  Education
                </h2>
                {state.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className='border border-gray-300 p-4 my-4 rounded-md shadow-sm bg-white space-y-3'
                  >
                    <div className='grid grid-cols-2 gap-4'>
                      <input
                        className='input-field'
                        placeholder='Title'
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
                        className='input-field'
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
                      className='input-field'
                      placeholder='Subtitle'
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
                    <div className='flex justify-between items-center'>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'ADD_EDUCATION_POINT',
                            eduIndex: idx
                          })
                        }
                        className='text-blue-500 text-sm hover:underline'
                      >
                        + Add Point
                      </button>
                      {state.education.length > 1 && (
                        <button
                          onClick={() =>
                            dispatch({ type: 'DELETE_EDUCATION', index: idx })
                          }
                          className='text-red-500 text-sm hover:underline'
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => dispatch({ type: 'ADD_EDUCATION' })}
                  className='btn-dark'
                >
                  + Add Education
                </button>
                <div className='mt-6 flex gap-4'>
                  <button onClick={() => setStep(1)} className='btn-secondary'>
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className='btn-primary'>
                    Next
                  </button>
                </div>
              </>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <>
                <h2 className='text-xl font-semibold text-gray-700'>
                  Experience
                </h2>
                {state.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className='border border-gray-300 p-4 my-4 rounded-md shadow-sm bg-white space-y-3'
                  >
                    <div className='grid grid-cols-2 gap-4'>
                      <input
                        className='input-field'
                        placeholder='Title'
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
                        className='input-field'
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
                      className='input-field'
                      placeholder='Subtitle'
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
                    <div className='flex justify-between items-center'>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'ADD_EXPERIENCE_POINT',
                            expIndex: idx
                          })
                        }
                        className='text-blue-500 text-sm hover:underline'
                      >
                        + Add Point
                      </button>
                      {state.experience.length > 1 && (
                        <button
                          onClick={() =>
                            dispatch({ type: 'DELETE_EXPERIENCE', index: idx })
                          }
                          className='text-red-500 text-sm hover:underline'
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setAIImprovementType('experience')
                        handleAIImprove('experience')
                      }}
                      className='btn-ai'
                    >
                      Improve with AI
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => dispatch({ type: 'ADD_EXPERIENCE' })}
                  className='btn-dark'
                >
                  + Add Experience
                </button>

                <div className='mt-4'>
                  <textarea
                    onChange={e => setAiExperiencePrompt(e.target.value)}
                    className='input-field h-24'
                  />
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className='prose' {...props} />
                      )
                    }}
                  >
                    {aiExperienceResponse}
                  </ReactMarkdown>

                  <button
                    onClick={handleExperienceAi}
                    className='btn-primary mt-2'
                  >
                    Generate
                  </button>
                </div>

                <div className='mt-6 flex gap-4'>
                  <button onClick={() => setStep(2)} className='btn-secondary'>
                    Back
                  </button>
                  <button onClick={() => setStep(4)} className='btn-primary'>
                    Next
                  </button>
                </div>
              </>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <>
                <h2 className='text-xl font-semibold text-gray-700'>
                  Projects
                </h2>
                {state.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className='border border-gray-300 p-4 my-4 rounded-md shadow-sm bg-white space-y-3'
                  >
                    <div className='grid grid-cols-2 gap-4'>
                      <input
                        className='input-field'
                        placeholder='Title'
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
                        className='input-field'
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
                      className='input-field'
                      placeholder='Subtitle'
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
                    <div className='flex justify-between items-center'>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'ADD_PROJECT_POINT',
                            projIndex: idx
                          })
                        }
                        className='text-blue-500 text-sm hover:underline'
                      >
                        + Add Point
                      </button>
                      {state.projects.length > 1 && (
                        <button
                          onClick={() =>
                            dispatch({ type: 'DELETE_PROJECT', index: idx })
                          }
                          className='text-red-500 text-sm hover:underline'
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => dispatch({ type: 'ADD_PROJECT' })}
                  className='btn-dark'
                >
                  + Add Project
                </button>
                <div className='mt-6 flex gap-4'>
                  <button onClick={() => setStep(3)} className='btn-secondary'>
                    Back
                  </button>
                  <button onClick={() => setStep(5)} className='btn-primary'>
                    Next
                  </button>
                </div>
              </>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <>
                <h2 className='text-xl font-semibold text-gray-700'>
                  Achievements
                </h2>
                {state.achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className='border border-gray-300 p-3 my-2 rounded bg-white'
                  >
                    <input
                      className='input-field'
                      placeholder='Achievement'
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
                        className='text-red-500 text-sm hover:underline mt-1'
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => dispatch({ type: 'ADD_ACHIEVEMENT' })}
                  className='btn-dark mt-2'
                >
                  + Add Achievement
                </button>
                <div className='mt-6 flex gap-4'>
                  <button onClick={() => setStep(4)} className='btn-secondary'>
                    Back
                  </button>
                  <button onClick={() => setStep(6)} className='btn-primary'>
                    Next
                  </button>
                </div>
              </>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <>
                <h2 className='text-xl font-semibold text-gray-700'>Skills</h2>
                {state.skills.map((skill, idx) => (
                  <div key={idx} className='flex gap-4 mb-3'>
                    <input
                      className='input-field w-1/2'
                      placeholder='Type'
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
                      className='input-field w-1/2'
                      placeholder='Tools'
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
                        className='text-red-500 text-sm hover:underline'
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => dispatch({ type: 'ADD_SKILL' })}
                  className='btn-dark'
                >
                  + Add Skill
                </button>
                <div className='mt-4'>
                  <textarea
                    onChange={e => setAiExperiencePrompt(e.target.value)}
                    className='input-field h-24'
                  />
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className='prose' {...props} />
                      )
                    }}
                  >
                    {aiSkillsResponse}
                  </ReactMarkdown>

                  <button
                    onClick={handleExperienceAi}
                    className='btn-primary mt-2'
                  >
                    Generate
                  </button>
                </div>
                <div className='mt-6 flex gap-4'>
                  <button onClick={() => setStep(5)} className='btn-secondary'>
                    Back
                  </button>
                  <button onClick={() => setStep(7)} className='btn-primary'>
                    Next
                  </button>
                </div>
              </>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <>
                <h2 className='text-xl font-semibold text-gray-700'>
                  Preview & Save
                </h2>
                <div className='mt-6 flex gap-4'>
                  <button onClick={() => setStep(6)} className='btn-secondary'>
                    Back
                  </button>
                  <button
                    onClick={() => {
                      console.log('Resume Data:', state)
                      alert('Resume generated! Check console for data')
                    }}
                    className='btn-success'
                  >
                    Generate Resume
                  </button>
                  <button onClick={handleSave} className='btn-primary'>
                    Save the resume
                  </button>
                </div>
              </>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='w-1/2 p-6'>
        {/* <button onClick={handleGeneratePDF} ... /> */}

        {loading ? (
          <div className='w-full h-[90vh] flex items-center justify-center text-gray-500'>
            <div className='animate-pulse text-xl font-semibold'>
              Generating PDF...
            </div>
          </div>
        ) : (
          state !== initialState &&
          pdfUrl && (
            <div
              className={`transition-opacity duration-300 ${
                loading ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <iframe
                src={pdfUrl}
                className='w-full h-[90vh] border'
                title='PDF Preview'
                type='application/pdf'
              />
            </div>
          )
        )}
        {showModal && (
          <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded w-[600px] max-h-[80vh] overflow-y-auto'>
              <h2 className='text-xl font-bold mb-4'>AI Suggestions</h2>
              {improvedPoints.map((point, idx) => (
                <div key={idx} className='mb-4'>
                  <p className='text-sm text-gray-500'>
                    {aiImprovementType === 'projects'
                      ? 'Project'
                      : 'Experience'}{' '}
                    {point.sectionIndex + 1}, Point {point.pointIndex + 1}
                  </p>

                  <p className='text-gray-800 line-through'>
                    {state[aiImprovementType]?.[point.sectionIndex]?.points?.[
                      point.pointIndex
                    ] ?? '[Original point not found]'}
                  </p>
                  <p className='text-green-700 font-semibold'>{point.text}</p>
                  <button
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
                    className='text-blue-600 text-sm mt-1'
                  >
                    ✅ Apply this suggestion
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowModal(false)}
                className='mt-4 px-4 py-2 bg-red-600 text-white rounded'
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}