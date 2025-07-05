import React from 'react'

const Info = () => {
  const steps = [
    {
      id: 0,
      title: 'Generate your resume',
      desc: "Let's make the perfect resume for you!",
      icon: ''
    },
    {
      id: 1,
      title: 'Improve your resume',
      desc: 'Make your resume perfect!',
      icon: ''
    },
    {
      id: 2,
      title: 'Generate a Cover Letter',
      desc: 'Improve your impression by the interviewer'
    },
    {
      id: 3,
      title: 'Store your Resumes',
      desc: 'All your resumes are safe and available whenever you need it!'
    },
    {
      id: 4,
      title: 'Improve your GitHub',
      desc: 'Get guide points to become the best developers!'
    }
  ]

  return (
    <div className='flex flex-col w-full'>
      <section>What we'll help you with!</section>
      <section className='grid grid-cols-1 gap-12'>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex md:flex-row ${
              (step.id % 2 == 1) ? 'md:flex-row-reverse' : ''
            } gap-6`}
          >
            {/* <img src="" alt="" /> */}
            <div>
              <h3>{step.title}</h3>
              <h4>{step.desc}</h4>
            </div>
          </div>
        ))}
      </section>
      <section>
        <h1>Become the perfect candidate!</h1>
        <span>Sign up today!</span>
      </section>
    </div>
  )
}

export default Info
