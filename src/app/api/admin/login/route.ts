import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password, rememberMe } = await request.json()

    // Simple authentication - replace with real authentication logic
    if (username === 'admin@codecommit.edu' && password === 'admin123') {
      const userData = {
        username,
        role: 'Super Admin',
        lastLogin: new Date().toISOString()
      }

      const response = NextResponse.json({
        success: true,
        user: userData,
        message: 'Login successful'
      })

      // Set authentication cookie
      response.cookies.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
        path: '/'
      })

      // Set user data cookie
      response.cookies.set('admin_user', JSON.stringify(userData), {
        httpOnly: false, // Allow client-side access for UI
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
        path: '/'
      })

      if (rememberMe) {
        response.cookies.set('admin_remember', 'true', {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60,
          path: '/'
        })
      }

      return response
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Logout endpoint - clear cookies
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })

  response.cookies.delete('admin_token')
  response.cookies.delete('admin_user')
  response.cookies.delete('admin_remember')

  return response
}
