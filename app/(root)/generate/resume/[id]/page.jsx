// app/resume/[id]/page.jsx
import EditResumePage from '@/components/EditResumePage'

export default function Page({ params }) {
  return <EditResumePage id={params.id} />
}