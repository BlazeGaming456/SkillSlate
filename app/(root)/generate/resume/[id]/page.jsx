//Generates the ResumeForm.jsx page with the details filled up when selected from the list of resumes on the dashboard

import EditResumePage from '@/components/EditResumePage'

export default function Page ({ params }) {
  return <EditResumePage id={params.id} />
}
