import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('hi')
  // Example of checking for an authentication token or session cookie
  const isAuthenticated = Boolean(request.cookies.get('auth-token')); // replace with your own auth check logic
  console.log(request.cookies.get('auth-token'), isAuthenticated)

  // List of paths that should not be redirected to the login page
  const publicPaths = ['/login', '/signup', '/public']; // Exclude login, signup, and public pages

  // Check if the user is not authenticated and is not already on public pages
  if (!isAuthenticated && !publicPaths.some((path) => request.url.includes(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow the request to proceed if authenticated or on public paths
  return NextResponse.next()
}

// Optionally, specify which routes to apply this middleware to
export const config = {
  matcher: ['/((?!_next|static|login|signup).*)'], // Skip Next.js static files and login/signup paths
}
