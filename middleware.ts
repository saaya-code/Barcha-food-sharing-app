import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const locales = ['en', 'ar']
const defaultLocale = 'en'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export async function middleware(req: NextRequest) {
  // Handle internationalization first - this should handle the root redirect
  const intlResponse = intlMiddleware(req)
  
  // If intl middleware wants to redirect, return that response
  if (intlResponse.status !== 200) {
    return intlResponse
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Handle auth callback - allow it to proceed without checks
  if (req.nextUrl.pathname.includes('/auth/callback')) {
    return res
  }

  // Optional: Add protected routes logic here if needed
  // For example, protect /profile, /add-item, etc.
  const protectedRoutes = ['/profile', '/add-item', '/requests', '/my-items', '/favorites']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.includes(route)
  )

  if (isProtectedRoute && !session) {
    // Get the current locale from the pathname
    const currentLocale = locales.find(locale => 
      req.nextUrl.pathname.startsWith(`/${locale}/`)
    ) || defaultLocale
    
    // Redirect to login if accessing protected route without session
    const redirectUrl = new URL(`/${currentLocale}/login`, req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
