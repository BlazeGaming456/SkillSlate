import React from 'react'
import Link from 'next/link'

const Features = () => {
    const features = [
        {
            id:0,
            title: "Resume Generation",
            subtitle: "Generate the perfect resume for you with the help of AI!",
            link: '/generate/resume',
            image: '',
            color: 'red',
        },
        {
            id:1,
            title: "Improve your Resume",
            subtitle: "Get tips to make your resume perfect!",
            link: '/improve',
            image: '',
            color: 'blue',
        },
        {
            id:2,
            title: "View your Resumes",
            subtitle: "All your resumes stored at one place!",
            link: '/dashboard',
            image: '',
            color: 'orange',
        },
        {
            id:3,
            title: "Generate Cover Letter",
            subtitle: "Elevate your impression by the interviewer with a cover letter!",
            link: '/generate/cover-letter',
            image: '',
            color: 'gray',
        },
        {
            id:4,
            title: 'GitHub Review',
            subtitle: "Know what and how to elevate you dev portfolio to the next level!",
            link: '/github',
            image: '',
            color: 'green',
        }
    ]
    return (
        <div>
            <section>
                Our Features
            </section>
            <section className='grid grid-cols-1 w-full'>
                {features.map((feature,index)=>(
                    <Link href={feature.link}>
                        <div key={feature.id} className=''>
                            {/* Left Side Part */}
                            <div className='md:w-1/2 p-8'>
                                <div>
                                    {/* <img src="" alt="" /> */}
                                    <span>{feature.title}</span>
                                </div>
                                <h3>{feature.subtitle}</h3>
                            </div>

                            {/* Right Side Image */}
                            <div>
                                {/* <img src="" alt="" /> */}
                            </div>
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    )
}

export default Features