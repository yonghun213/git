
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@/src/generated/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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

export default async function AdminPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (!sessionCookie) {
    redirect('/')
  }
  
  const session = parseSession(sessionCookie.value)
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' }
  })

  async function createUser(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    if (!email || !password || !role) {
      redirect('/dashboard/admin?error=missing_fields')
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      redirect('/dashboard/admin?error=user_exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        name: name || null,
        password_hash: passwordHash,
        role
      }
    })

    redirect('/dashboard/admin?success=user_created')
  }

  async function resetPassword(formData: FormData) {
    'use server'
    const userId = formData.get('userId') as string
    const newPassword = formData.get('newPassword') as string

    if (!userId || !newPassword) {
      redirect('/dashboard/admin?error=missing_fields')
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: passwordHash }
    })

    redirect('/dashboard/admin?success=password_reset')
  }

  async function updateRole(formData: FormData) {
    'use server'
    const userId = formData.get('userId') as string
    const role = formData.get('role') as string

    if (!userId || !role) {
      redirect('/dashboard/admin?error=missing_fields')
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role }
    })

    redirect('/dashboard/admin?success=role_updated')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-slate-500 mt-1">Manage users, roles, and system settings</p>
      </div>

      {/* Create User Form */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-slate-50">
          <h2 className="font-bold text-gray-800">Create New User</h2>
        </div>
        <form action={createUser} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select role...</option>
                <option value="ADMIN">Admin</option>
                <option value="PM">Project Manager</option>
                <option value="CONTRIBUTOR">Contributor</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-slate-50">
          <h2 className="font-bold text-gray-800">Manage Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{user.name || 'No name'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <form action={updateRole} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="PM">PM</option>
                        <option value="CONTRIBUTOR">Contributor</option>
                        <option value="VIEWER">Viewer</option>
                      </select>
                      <button
                        type="submit"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Update
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <form action={resetPassword} className="inline-flex items-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New password"
                        className="w-32 text-sm border border-gray-300 rounded px-2 py-1"
                      />
                      <button
                        type="submit"
                        className="text-xs text-orange-600 hover:text-orange-800"
                      >
                        Reset
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
