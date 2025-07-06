'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ResumeForm from '@/components/ResumeForm'

export default function EditResumePage ({ id }) {
  const { data: session, status } = useSession()
  const [resume, setResume] = useState(null)
  const [error, setError] = useState(null)

  console.log(resume);

  useEffect(() => {
    const fetchResume = async () => {
      if (status === 'authenticated') {
        try {
          const res = await fetch(`/api/resume/${id}`)
          if (!res.ok) throw new Error('Failed to fetch resume')
          const data = await res.json()
          setResume(data)
        } catch (err) {
          setError(err.message)
        }
      }
    }

    fetchResume()
  }, [status, id])

  if (status === 'loading') return <div>Loading session...</div>
  if (status !== 'authenticated') return <div>Please sign in</div>
  if (error) return <div className='text-red-500'>Error: {error}</div>
  if (!resume) return <div>Loading resume...</div>

  return (
    <div className='p-6'>
      <ResumeForm initialData={resume.data} resumeId={resume.id} />
    </div>
  )
}