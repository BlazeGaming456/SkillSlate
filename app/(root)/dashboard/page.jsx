//Dashboard page that provides the analytics and stores the resumes to be viewed, edited or deleted as required

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ResumeListClient from '@/components/ResumeListClient'
import { motion } from 'framer-motion'

export default function DashboardPage () {
  const { data: session, status } = useSession()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  //Fetches resumes from the API when the user is authenticated
  const fetchResumes = async () => {
    if (status === 'authenticated') {
      try {
        const res = await fetch('/api/resumes')
        if (!res.ok) {
          // If unauthorized, force sign out or show error
          setResumes([])
          setLoading(false)
          return
        }
        const data = await res.json()
        if (Array.isArray(data)) {
          setResumes(data)
        } else {
          setResumes([])
        }
      } catch (err) {
        setResumes([])
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [status])

  //Handles the deletion of a resume by filtering it out from the resumes state
  const handleDelete = deletedId => {
    setResumes(prevResumes =>
      prevResumes.filter(resume => resume.id !== deletedId)
    )
  }

  //Show different page depedning on the session status
  if (status === 'loading')
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[#00f5a0] mx-auto mb-4'></div>
          <div className='text-[#00f5a0] text-xl font-mono font-bold animate-pulse'>
            Loading session...
          </div>
        </div>
      </div>
    )

  if (status !== 'authenticated')
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-400 text-xl font-mono font-bold'>
            Not signed in
          </div>
        </div>
      </div>
    )

  if (loading)
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[#00f5a0] mx-auto mb-4'></div>
          <div className='text-[#00f5a0] text-xl font-mono font-bold animate-pulse'>
            Loading resumes...
          </div>
        </div>
      </div>
    )

  //Calculate best and average ATS scores for analytics
  const bestScore =
    resumes.length > 0 ? Math.max(...resumes.map(r => r.atsScore)) : 0
  const avgScore =
    resumes.length > 0
      ? resumes.reduce((acc, r) => acc + r.atsScore, 0) / resumes.length
      : 0

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-5xl font-bold text-white font-mono mb-4'>
            Dashboard
          </h1>
          <p className='text-gray-400 text-xl font-mono'>
            Welcome back, {session?.user?.name || 'User'}
          </p>
        </motion.div>

        {/* Analytics Section */}
        <motion.section
          className='mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <AnalyticsCard
              title='Best ATS Score'
              value={bestScore}
              icon='🏆'
              color='from-emerald-800 to-emerald-700'
            />
            <AnalyticsCard
              title='Average Score'
              value={avgScore.toFixed(2)}
              icon='📊'
              color='from-blue-800 to-blue-700'
            />
            <AnalyticsCard
              title='Total Resumes'
              value={resumes.length}
              icon='📄'
              color='from-purple-800 to-purple-700'
            />
            <AnalyticsCard
              title='Last Created'
              value={
                resumes.length > 0
                  ? new Date(resumes[0].createdAt).toLocaleDateString()
                  : 'N/A'
              }
              icon='📅'
              color='from-amber-800 to-amber-700'
            />
          </div>
        </motion.section>

        {/* Resumes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className='bg-[#2a2a2a] rounded-2xl shadow-2xl border border-gray-700 p-8'>
            <ResumeListClient resumes={resumes} onDelete={handleDelete} />
          </div>
        </motion.section>
      </div>
    </div>
  )
}

//Analytics card component to display various statistics
function AnalyticsCard ({ title, value, icon, color }) {
  return (
    <motion.div
      className={`bg-gradient-to-br ${color} rounded-2xl shadow-2xl border border-gray-600 p-6 backdrop-blur-sm`}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className='flex items-center justify-between mb-4'>
        <div className='w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center'>
          <span className='text-2xl'>{icon}</span>
        </div>
        <div className='text-right'>
          <p className='text-gray-300 text-sm font-mono'>{title}</p>
          <p className='text-3xl font-bold text-white font-mono'>{value}</p>
        </div>
      </div>
    </motion.div>
  )
}
