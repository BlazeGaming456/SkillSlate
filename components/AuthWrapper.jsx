//Used to wrap the protected routes and re-route if not authenticated

'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

//List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/sign-in', '/sign-up']

//List of routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/generate/resume',
  '/generate/cover-letter',
  '/improve',
  '/github',
  '/job-description'
]

export default function AuthWrapper ({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if the current route requires authentication
    const isProtectedRoute = protectedRoutes.some(
      route => pathname === route || pathname.startsWith(route + '/')
    )

    // If not loading and not authenticated and on a protected route, redirect to login
    if (status === 'unauthenticated' && isProtectedRoute) {
      router.push('/login')
    }
  }, [session, status, router, pathname])

  // Check if the current route requires authentication
  const isProtectedRoute = protectedRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  )

  // Show loading spinner only for protected routes while checking authentication
  if (status === 'loading' && isProtectedRoute) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[#00f5a0] mx-auto mb-4'></div>
          <div className='text-[#00f5a0] text-xl font-mono font-bold animate-pulse'>
            Loading...
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated and on a protected route, redirect to login
  if (status === 'unauthenticated' && isProtectedRoute) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[#00f5a0] mx-auto mb-4'></div>
          <div className='text-[#00f5a0] text-xl font-mono font-bold animate-pulse'>
            Redirecting to login...
          </div>
        </div>
      </div>
    )
  }

  // If authenticated or on a public route, render children
  return children
}
