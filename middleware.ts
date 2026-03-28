import { auth } from './lib/auth'

export default auth((req: any) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (pathname.startsWith('/admin-panel') && session?.user?.role !== 'ADMIN') {
    return Response.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/manage-jobs') && session?.user?.role !== 'PROVIDER') {
    return Response.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/profile') && !session) {
    return Response.redirect(new URL('/login', req.url))
  }

  // Add more protections as needed

  return null
})
