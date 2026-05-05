import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_URL = 'https://api.freeapi.app/api/v1/public/meals'

interface Meal {
  id: number
  idMeal: string
  strMeal: string
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strTags: string | null
  strYoutube: string | null
}

interface ApiResponse {
  statusCode: number
  data: {
    page: number
    limit: number
    totalPages: number
    previousPage: boolean
    nextPage: boolean
    totalItems: number
    currentPageItems: number
    data: Meal[]
  }
  message: string
  success: boolean
}

export default function MealsListing() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)

  const fetchMeals = async (pageNum: number = 1) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}?page=${pageNum}&limit=12`)
      if (!res.ok) throw new Error('Failed to fetch meals')
      const data: ApiResponse = await res.json()
      if (data.success && data.data?.data) {
        setMeals(data.data.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeals()
  }, [])

  return (
    <div className="min-h-screen p-8">
      <nav className="mb-8">
        <Link to="/" className="inline-flex items-center text-[#2d2d2d] no-underline font-medium px-4 py-2 border-2 border-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all">
          ← Back to Projects
        </Link>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-[#2d2d2d]">Meals & Recipes</h1>
        <p className="text-[#6b6b6b] mt-1">Delicious recipes from around the world</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading && meals.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="text-[#6b6b6b]">Loading meals...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <div
                key={meal.id}
                onClick={() => setSelectedMeal(meal)}
                className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[6px_6px_0_#2d2d2d] transition-all duration-200 cursor-pointer"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[#2d2d2d] font-medium text-sm line-clamp-2 mb-2">
                    {meal.strMeal}
                  </h3>
                  <div className="flex gap-2">
                    <span className="text-xs bg-[#e8d5c4] text-[#2d2d2d] px-2 py-0.5 rounded">
                      {meal.strCategory}
                    </span>
                    <span className="text-xs bg-[#2d2d2d] text-[#faf8f5] px-2 py-0.5 rounded">
                      {meal.strArea}
                    </span>
                  </div>
                  {meal.strTags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {meal.strTags.split(',').map((tag) => (
                        <span key={tag} className="text-xs text-[#6b6b6b]">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => { const p = page - 1; setPage(p); fetchMeals(p) }}
              disabled={page === 1 || loading}
              className="px-4 py-2 border-2 border-[#2d2d2d] rounded-lg font-medium hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-[#6b6b6b]">Page {page}</span>
            <button
              onClick={() => { const p = page + 1; setPage(p); fetchMeals(p) }}
              disabled={loading}
              className="px-4 py-2 border-2 border-[#2d2d2d] rounded-lg font-medium hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedMeal(null)}>
          <div className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={selectedMeal.strMealThumb}
                alt={selectedMeal.strMeal}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#2d2d2d]">{selectedMeal.strMeal}</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-[#e8d5c4] text-[#2d2d2d] px-2 py-0.5 rounded">
                      {selectedMeal.strCategory}
                    </span>
                    <span className="text-xs bg-[#2d2d2d] text-[#faf8f5] px-2 py-0.5 rounded">
                      {selectedMeal.strArea}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="text-[#6b6b6b] hover:text-[#2d2d2d] text-2xl"
                >
                  ×
                </button>
              </div>

              {selectedMeal.strTags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMeal.strTags.split(',').map((tag) => (
                    <span key={tag} className="text-xs bg-[#e8d5c4] text-[#2d2d2d] px-2 py-0.5 rounded">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#2d2d2d] mb-2">Instructions</h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed whitespace-pre-line">
                  {selectedMeal.strInstructions}
                </p>
              </div>

              {selectedMeal.strYoutube && (
                <a
                  href={selectedMeal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  ▶ Watch on YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}