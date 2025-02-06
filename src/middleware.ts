import { defineMiddleware } from 'astro:middleware'
import { getSession } from 'auth-astro/server'

// const privateRoutes = ['/', '/protected']
// const publicRoutes = ['/login', '/register']

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect, request }: any, next: any) => {
    const session = await getSession(request)
    const isLoggedIn = session !== null

    const user = session?.user

    locals.isLoggedIn = isLoggedIn
    locals.user = null
    locals.isAdmin = false

    if (user) {
      locals.user = {
        email: user.email,
        name: user.name
      }

      locals.isAdmin = user.role === 'admin'
    }

    if (isLoggedIn && url.pathname.startsWith('/dashboard')) {
      return redirect('/')
    }

    return next()
  }
)
