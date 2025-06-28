'use client'

import React, { useEffect, useReducer, useState } from 'react'
import { generateLatexFromState } from '@/components/resumePreview'

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
  skills: [{ type: '', tools: '' }]
}

export default function ResumeBuilderPage () {
  const [state, dispatch] = useReducer(resumeReducer, initialState)
  const [step, setStep] = useState(1)
  const [pdfUrl, setPdfUrl] = useState('')

  //Generating the live resume preview url
  //useEffect doesn't directly support sdync, so you have to create a function within it
  useEffect(() => {
    const generatePdfUrl = async () => {
      const latex = generateLatexFromState(state)

      console.log(latex);

      const res = await fetch('https://latex-compiler-backend-production.up.railway.app/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: latex, compiler: 'pdflatex' })
      })

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
  }, [state])

  const renderPointInputs = (points, sectionType, sectionIndex) =>
    points.map((point, i) => (
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
                : 'UPDATE_EXPERIENCE_POINT',
            eduIndex: sectionType === 'education' ? sectionIndex : undefined,
            expIndex: sectionType === 'experience' ? sectionIndex : undefined,
            pointIndex: i,
            payload: e.target.value
          })
        }
      />
    ))

  return (
    <div className='flex'>
      <div className='w-1/2 p-6 space-y-6'>
        {step === 1 && (
          <>
            <h2 className='text-2xl font-bold'>Personal Details</h2>
            {['name', 'email', 'phone', 'github', 'linkedin'].map(field => (
              <input
                key={field}
                className='border p-2 w-full'
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={state[field]}
                onChange={e =>
                  dispatch({
                    type: `SET_${field.toUpperCase()}`,
                    field,
                    payload: e.target.value
                  })
                }
              />
            ))}
            <button
              onClick={() => setStep(2)}
              className='bg-blue-600 text-white px-4 py-2 mt-4 rounded'
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className='text-2xl font-bold'>Education</h2>
            {state.education.map((edu, idx) => (
              <div key={idx} className='border p-4 my-2 rounded space-y-2'>
                <input
                  className='border p-2 w-full'
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
                  className='border p-2 w-full'
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
                <input
                  className='border p-2 w-full'
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
                <button
                  onClick={() =>
                    dispatch({ type: 'ADD_EDUCATION_POINT', eduIndex: idx })
                  }
                  className='text-sm text-blue-500'
                >
                  + Add Point
                </button>
                {state.education.length > 1 && (
                  <button
                    onClick={() =>
                      dispatch({ type: 'DELETE_EDUCATION', index: idx })
                    }
                    className='text-sm text-red-500 ml-4'
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => dispatch({ type: 'ADD_EDUCATION' })}
              className='bg-gray-700 text-white px-4 py-2 rounded'
            >
              + Add Education
            </button>
            <div className='mt-4 flex gap-4'>
              <button
                onClick={() => setStep(1)}
                className='bg-gray-500 text-white px-4 py-2 rounded'
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className='bg-blue-600 text-white px-4 py-2 rounded'
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className='text-2xl font-bold'>Skills</h2>
            {state.skills.map((skill, idx) => (
              <div key={idx} className='flex gap-4 mb-2'>
                <input
                  className='border p-2 w-1/2'
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
                  className='border p-2 w-1/2'
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
                    className='text-sm text-red-500'
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => dispatch({ type: 'ADD_SKILL' })}
              className='bg-gray-700 text-white px-4 py-2 rounded'
            >
              + Add Skill
            </button>
            <div className='mt-4 flex gap-4'>
              <button
                onClick={() => setStep(2)}
                className='bg-gray-500 text-white px-4 py-2 rounded'
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className='bg-blue-600 text-white px-4 py-2 rounded'
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className='text-2xl font-bold'>Experience</h2>
            {state.experience.map((exp, idx) => (
              <div key={idx} className='border p-4 my-2 rounded space-y-2'>
                <input
                  className='border p-2 w-full'
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
                  className='border p-2 w-full'
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
                <input
                  className='border p-2 w-full'
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
                <button
                  onClick={() =>
                    dispatch({ type: 'ADD_EXPERIENCE_POINT', expIndex: idx })
                  }
                  className='text-sm text-blue-500'
                >
                  + Add Point
                </button>
                {state.experience.length > 1 && (
                  <button
                    onClick={() =>
                      dispatch({ type: 'DELETE_EXPERIENCE', index: idx })
                    }
                    className='text-sm text-red-500 ml-4'
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => dispatch({ type: 'ADD_EXPERIENCE' })}
              className='bg-gray-700 text-white px-4 py-2 rounded'
            >
              + Add Experience
            </button>
            <div className='mt-4 flex gap-4'>
              <button
                onClick={() => setStep(3)}
                className='bg-gray-500 text-white px-4 py-2 rounded'
              >
                Back
              </button>
              <button
                className='bg-green-600 text-white px-4 py-2 rounded'
                onClick={() => {
                  console.log('Resume Data:', state)
                  alert('Resume generated! Check console for data')
                }}
              >
                Generate Resume
              </button>
            </div>
          </>
        )}
      </div>
      <div className='w-1/2 p-6'>
        {state !== initialState && (
          <iframe
            src={pdfUrl}
            className='w-full h-[90vh] border'
            title='PDF Preview'
            type='application/pdf'
          />
        )}
        <a href={pdfUrl}>Let's go</a>
      </div>
    </div>
  )
}
