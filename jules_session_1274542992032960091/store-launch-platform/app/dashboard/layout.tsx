
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface SessionData {
  userId: string
  email: string
  role: string
  name: string | null
}

function parseSession(sessionCookie: string): SessionData | null {
  try {
    const decoded = Buffer.from(sessionCookie, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    redirect('/')
  }

  const session = parseSession(sessionCookie.value)
  if (!session) {
    redirect('/')
  }

  const isAdmin = session.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <Link href="/dashboard" className="text-xl font-bold text-slate-800">StoreLaunch</Link>
           <nav className="hidden md:flex space-x-4 text-sm font-medium text-gray-600">
             <Link href="/dashboard" className="hover:text-blue-600">Overview</Link>
             <Link href="/dashboard/stores" className="hover:text-blue-600">Stores</Link>
             <Link href="/dashboard/pricing" className="hover:text-blue-600">Pricing</Link>
             {isAdmin && (
               <Link href="/dashboard/admin" className="hover:text-blue-600">Admin</Link>
             )}
           </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">{session.name || session.email}</div>
            <div className="text-xs text-gray-500">{session.role}</div>
          </div>
          <form action={async () => {
            'use server'
            const c = await cookies()
            c.delete('session')
            c.delete('user_id')
            redirect('/')
          }}>
            <button className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition-colors">
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
