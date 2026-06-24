//Generates the ResumeForm.jsx page with the details filled up when selected from the list of resumes on the dashboard

import EditResumePage from '@/components/EditResumePage'

export default async function Page ({ params }) {
  const { id } = await params;
  return <EditResumePage id={id} />
}
