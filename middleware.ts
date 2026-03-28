// Middleware disabled - using custom auth system
// import { auth } from './lib/auth'

export default function middleware(req: any) {
  // Custom auth middleware can be implemented here if needed
  return null
}

export const config = {
  matcher: ['/admin-panel/:path*', '/manage-jobs/:path*', '/profile/:path*']
}
