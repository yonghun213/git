
import { PrismaClient } from '@/src/generated/client'

const prisma = new PrismaClient()

export default async function PricingPage() {
  const ingredients = await prisma.ingredient.findMany({
    include: {
      prices: {
        orderBy: { as_of: 'desc' }
      }
    },
    orderBy: { name: 'asc' }
  })

  const recipes = await prisma.recipe.findMany({
    include: {
      lines: {
        include: {
          ingredient: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Pricing & Cost Management</h1>
        <p className="text-slate-500 mt-1">Manage ingredient prices, recipes, and menu costing</p>
      </div>

      {/* Ingredients Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">Ingredients ({ingredients.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingredients.map(ing => {
                const latestPrice = ing.prices[0]
                return (
                  <tr key={ing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{ing.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{ing.category || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{ing.unit_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {latestPrice ? (
                        <span>
                          {latestPrice.currency} {latestPrice.price.toFixed(2)} / {latestPrice.package_size}{latestPrice.package_unit}
                        </span>
                      ) : (
                        <span className="text-slate-400">No price data</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {ingredients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No ingredients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recipes Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">Recipes ({recipes.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipe Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Cost %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recipes.map(recipe => (
                <tr key={recipe.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{recipe.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{recipe.menu_item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{recipe.country || 'Global'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{recipe.lines.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{(recipe.target_cost_pct * 100).toFixed(0)}%</td>
                </tr>
              ))}
              {recipes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No recipes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
