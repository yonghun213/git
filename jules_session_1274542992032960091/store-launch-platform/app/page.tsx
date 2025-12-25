
import { PrismaClient } from '@/src/generated/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  
  // Check if already logged in
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  if (sessionCookie) {
    redirect('/dashboard')
  }

  async function login(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      redirect('/?error=missing_credentials')
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      redirect('/?error=invalid_credentials')
    }

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      redirect('/?error=invalid_credentials')
    }

    // Create session
    const c = await cookies()
    const sessionData = JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    })
    
    c.set('session', Buffer.from(sessionData).toString('base64'), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    
    c.set('user_id', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Store Launch Ops</h1>
        <p className="mb-6 text-gray-600 text-center text-sm">Sign in to your account</p>
        
        {params.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {params.error === 'invalid_credentials' ? 'Invalid email or password' : 
             params.error === 'missing_credentials' ? 'Please provide email and password' :
             'Login failed. Please try again.'}
          </div>
        )}
        
        <form action={login} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              name="password" 
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Demo credentials: admin@example.com / password123
          </p>
        </div>
      </div>
    </div>
  )
}
