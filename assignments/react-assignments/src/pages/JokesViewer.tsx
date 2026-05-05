import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_URL = 'https://api.freeapi.app/api/v1/public/randomjokes'

interface Joke {
  id: number
  content: string
  categories: string[]
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
    data: Joke[]
  }
  message: string
  success: boolean
}

export default function JokesViewer() {
  const [jokes, setJokes] = useState<Joke[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [showExplicit, setShowExplicit] = useState(false)

  const fetchJokes = async (pageNum: number = 1) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}?page=${pageNum}&limit=12`)
      if (!res.ok) throw new Error('Failed to fetch jokes')
      const data: ApiResponse = await res.json()
      if (data.success && data.data?.data) {
        setJokes(data.data.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJokes()
  }, [])

  const filteredJokes = showExplicit ? jokes : jokes.filter(j => j.categories.length === 0 || !j.categories.includes('explicit'))

  return (
    <div className="min-h-screen p-8">
      <nav className="mb-8">
        <Link to="/" className="inline-flex items-center text-[#2d2d2d] no-underline font-medium px-4 py-2 border-2 border-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all">
          ← Back to Projects
        </Link>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-[#2d2d2d]">Jokes</h1>
        <p className="text-[#6b6b6b] mt-1">Get your daily dose of laughter</p>
      </header>

      <div className="flex justify-center mb-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showExplicit}
            onChange={(e) => setShowExplicit(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-[#6b6b6b]">Show explicit jokes</span>
        </label>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading && jokes.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="text-[#6b6b6b]">Loading jokes...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {filteredJokes.map((joke) => (
              <div
                key={joke.id}
                className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl p-6 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2d2d2d] transition-all duration-200"
              >
                <p className="text-[#2d2d2d] text-lg leading-relaxed">
                  {joke.content}
                </p>
                {joke.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#2d2d2d]/20">
                    {joke.categories.map((cat) => (
                      <span
                        key={cat}
                        className={`text-xs px-2 py-0.5 rounded ${
                          cat === 'explicit' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-[#e8d5c4] text-[#2d2d2d]'
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => { const p = page - 1; setPage(p); fetchJokes(p) }}
              disabled={page === 1 || loading}
              className="px-4 py-2 border-2 border-[#2d2d2d] rounded-lg font-medium hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-[#6b6b6b]">Page {page}</span>
            <button
              onClick={() => { const p = page + 1; setPage(p); fetchJokes(p) }}
              disabled={loading}
              className="px-4 py-2 border-2 border-[#2d2d2d] rounded-lg font-medium hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}