import ResumeForm from '@/components/ResumeForm'

export default function GenerateResumePage() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Create a New Resume</h1>
      <ResumeForm initialData={null} />
    </div>
  )
}