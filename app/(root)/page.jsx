import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div className='flex flex-col'>
      <Link href='/generate/resume' >Generate Resume</Link>
      <Link href='/generate/cover-letter' >Generate Cover Letter</Link>
      <Link href='/improve' >Improve Resume</Link>
      <Link href='/job-description' >Job Description</Link>
      <Link href='/dashboard' >Dashboard</Link>
    </div>
  )
}

export default page