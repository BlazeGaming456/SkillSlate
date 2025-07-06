'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ResumeListClient ({ resumes, onDelete }) {
  const { data: session } = useSession()
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async resumeId => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return
    }

    setDeletingId(resumeId)
    try {
      const res = await fetch(`/api/resume/${resumeId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        // Call the parent's onDelete function to refresh the list
        if (onDelete) {
          onDelete(resumeId)
        }
      } else {
        alert('Failed to delete resume')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete resume')
    } finally {
      setDeletingId(null)
    }
  }

  const handleViewPDF = async resumeId => {
    try {
      // Open PDF in new tab
      window.open(`/api/resume/${resumeId}?format=pdf`, '_blank')
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF')
    }
  }

  return (
    <div className='grid gap-4'>
      {resumes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center py-12'
        >
          <div className='w-20 h-20 bg-[#00f5a0] rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-3xl'>📄</span>
          </div>
          <h3 className='text-xl font-bold text-white font-mono mb-2'>
            No Resumes Yet
          </h3>
          <p className='text-gray-400 font-mono'>
            Create your first resume to get started!
          </p>
        </motion.div>
      ) : (
        resumes.map((resume, i) => (
          <motion.div
            key={resume.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className='bg-[#3a3a3a] rounded-xl border border-gray-600 p-6 hover:border-[#00f5a0] hover:shadow-lg hover:shadow-[#00f5a0]/20 transition-all duration-300'
            whileHover={{ y: -2 }}
          >
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h3 className='text-xl font-bold text-white font-mono mb-1'>
                  {resume.name ||
                    `${session?.user?.name || 'Your'} Resume #${i + 1}`}
                </h3>
                <p className='text-gray-400 text-sm font-mono'>
                  Created: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className='flex items-center gap-3'>
                {resume.atsScore && (
                  <div className='bg-[#00f5a0] bg-opacity-10 border border-[#00f5a0] border-opacity-30 rounded-lg px-3 py-1'>
                    <span className='text-[#00f5a0] font-bold font-mono text-sm'>
                      ATS: {resume.atsScore}
                    </span>
                  </div>
                )}
                <motion.button
                  onClick={() => handleDelete(resume.id)}
                  disabled={deletingId === resume.id}
                  className='bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-mono font-medium px-3 py-2 rounded-lg transition-all duration-300'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {deletingId === resume.id ? 'Deleting...' : 'Delete'}
                </motion.button>
              </div>
            </div>

            <div className='flex gap-3'>
              <motion.a
                href={`/generate/resume/${resume.id}`}
                className='bg-gray-600 hover:bg-gray-500 text-white font-mono font-medium px-4 py-2 rounded-lg transition-all duration-300'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit
              </motion.a>
              <motion.button
                onClick={() => handleViewPDF(resume.id)}
                className='bg-[#00f5a0] hover:bg-[#00d488] text-black font-mono font-bold px-4 py-2 rounded-lg transition-all duration-300'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View PDF
              </motion.button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  )
}
