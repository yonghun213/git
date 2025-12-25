
import { PrismaClient } from '@/src/generated/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    include: {
      tasks: {
        where: {
          status: { not: 'DONE' }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  // Group stores by country
  const storesByCountry = stores.reduce((acc, store) => {
    if (!acc[store.country]) {
      acc[store.country] = []
    }
    acc[store.country].push(store)
    return acc
  }, {} as Record<string, typeof stores>)

  const countries = Object.keys(storesByCountry).sort()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Stores</h1>
        <div className="text-sm text-slate-500">
          {stores.length} store{stores.length !== 1 ? 's' : ''} across {countries.length} countr{countries.length !== 1 ? 'ies' : 'y'}
        </div>
      </div>

      {countries.map(country => (
        <div key={country} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-slate-50">
            <h3 className="font-bold text-gray-800">{country} ({storesByCountry[country].length})</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned Open</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Tasks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {storesByCountry[country].map(store => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600 hover:text-blue-800">
                    <Link href={`/dashboard/stores/${store.id}`}>{store.name}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{store.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {store.planned_open_date ? new Date(store.planned_open_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${store.status === 'OPEN' ? 'bg-green-100 text-green-800' : 
                        store.status === 'PLANNING' ? 'bg-yellow-100 text-yellow-800' : 
                        store.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {store.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {store.tasks.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {stores.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12 text-center text-gray-500">
          No stores found. Create your first store to get started.
        </div>
      )}
    </div>
  )
}
