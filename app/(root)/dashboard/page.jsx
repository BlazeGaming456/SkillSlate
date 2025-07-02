// app/(root)/dashboard/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ResumeListClient from '@/components/ResumeListClient'

export default function DashboardPage () {
  const { data: session, status } = useSession()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResumes = async () => {
      if (status === 'authenticated') {
        const res = await fetch('/api/resumes') // you should create this API route
        const data = await res.json()
        setResumes(data)
        setLoading(false)
      }
    }

    fetchResumes()
  }, [status])

  if (status === 'loading') return <p className='p-6'>Loading session...</p>
  if (status !== 'authenticated')
    return <p className='p-6 text-red-500'>Not signed in</p>
  if (loading) return <p className='p-6'>Loading resumes...</p>

  //Here, we first destruct the resume, replacing each with its ats score, and find the maximum score among them
  const bestScore = Math.max(...resumes.map(r=>r.atsScore));
  //Here acc is the sum varaible, r is the specific resume, and 0 referes to the initial sum value
  const avgScore = resumes.reduce((acc,r)=>acc+r.atsScore,0)/resumes.length;

  return (
    <div className='p-6'>
      <section className='grid grid-cols-2 gap-4 mb-8'>
        <AnalyticsCard title='Best ATS Score' value={bestScore} />
        <AnalyticsCard title='Average Score' value={avgScore.toFixed(2)} />
        <AnalyticsCard title='Total Resumes' value={resumes.length} />
        <AnalyticsCard title='Last Created' value={new Date(resumes[0].createdAt).toDateString()} />
      </section>
      <section>
        <h2 className='text-2xl font-bold mb-4'>Your Resumes</h2>
        <ResumeListClient resumes={resumes} />
      </section>
    </div>
  )
}

function AnalyticsCard({ title, value }) {
  return (
    <div className='p-4 border rounded shadow bg-white'>
      <p className='text-gray-500'>{title}</p>
      <p className='text-2xl font-bold'>{value}</p>
    </div>
  )
}