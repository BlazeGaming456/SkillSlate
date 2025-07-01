'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginButton () {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <p>Welcome to SkillSlate!</p>
        <p>
          {session.user.name} ({session.user.email})
        </p>
        <img
          src={session.user.image}
          alt='profile'
          className='w-12 h-12 rounded-full'
        />
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    )
  }

  return <button onClick={() => signIn('google')}>Sign in with Google</button>
}
