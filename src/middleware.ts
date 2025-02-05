import { defineMiddleware } from 'astro:middleware'

const privateRoutes = ['/', '/protected']
const publicRoutes = ['/login', '/register']

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect }: any, next: any) => {
    const isLoggedIn = false

    locals.isLoggedIn = isLoggedIn
    locals.user = null

    if (isLoggedIn && url.pathname.startsWith('/dashboard')) {
      return redirect('/')
    }

    return next()
  }
)
