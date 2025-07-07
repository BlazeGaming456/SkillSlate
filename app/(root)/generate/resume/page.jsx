//Generates a new resume form page for the user to fill out

import ResumeForm from '@/components/ResumeForm'

export default function GenerateResumePage () {
  return (
    <div className='p-6'>
      <ResumeForm initialData={null} />
    </div>
  )
}
