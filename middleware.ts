import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get token from localStorage (not available in middleware) or cookies
  // For now, we'll use a cookie-based approach since localStorage isn't available in middleware

  const adminToken = request.cookies.get('admin_token')?.value
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  // If accessing admin routes (except login) without authentication, redirect to login
  if (isAdminRoute && !isLoginPage && !adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If accessing login page while authenticated, redirect to admin dashboard
  if (isLoginPage && adminToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
