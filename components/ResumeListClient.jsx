'use client'

import { useSession } from 'next-auth/react'

export default function ResumeListClient ({ resumes }) {
  const { data: session } = useSession()

  return (
    <div className='grid gap-4'>
      {resumes.map((resume, i) => (
        <div key={resume.id} className='border p-4 rounded shadow'>
          <div>
            <p className='font-semibold'>
              {resume.name ||
                `${session?.user?.name || 'Your'} Resume #${i + 1}`}
            </p>
            <p className='text-sm text-gray-600'>
              Created: {new Date(resume.createdAt).toLocaleString()}
            </p>
          </div>
          <a
            href={`/generate/resume/${resume.id}`}
            className='text-blue-600 hover:underline mt-2 block'
          >
            View/Edit
          </a>
        </div>
      ))}
    </div>
  )
}