import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_URL = 'https://api.freeapi.app/api/v1/public/cats/cat/random'

interface Cat {
  id: string
  name: string
  temperament: string
  origin: string
  description: string
  life_span: string
  indoor: number
  lap: number
  adaptability: number
  affection_level: number
  energy_level: number
  intelligence: number
  grooming: number
  health_issues: number
  social_needs: number
  image: string
  weight: {
    imperial: string
    metric: string
  }
}

interface ApiResponse {
  statusCode: number
  data: Cat
  message: string
  success: boolean
}

function RatingBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const percentage = (value / max) * 100
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#6b6b6b] w-20">{label}</span>
      <div className="flex-1 h-2 bg-[#e8d5c4] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2d2d2d] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default function CatViewer() {
  const [cat, setCat] = useState<Cat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState<Cat[]>([])

  const fetchCat = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Failed to fetch cat')
      const data: ApiResponse = await res.json()
      if (data.success && data.data) {
        setCat(data.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCat()
  }, [])

  const addToFavorites = () => {
    if (cat && !favorites.find(c => c.id === cat.id)) {
      setFavorites([...favorites, cat])
    }
  }

  return (
    <div className="min-h-screen p-8">
      <nav className="mb-8">
        <Link to="/" className="inline-flex items-center text-[#2d2d2d] no-underline font-medium px-4 py-2 border-2 border-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all">
          ← Back to Projects
        </Link>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-[#2d2d2d]">Random Cat Viewer</h1>
        <p className="text-[#6b6b6b] mt-1">Meet a new furry friend</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-[#6b6b6b]">Finding a cat...</div>
        </div>
      ) : cat ? (
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl overflow-hidden hover:shadow-[6px_6px_0_#2d2d2d] transition-all">
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#2d2d2d]">{cat.name}</h2>
                  <p className="text-[#6b6b6b]">{cat.origin}</p>
                </div>
                <button
                  onClick={addToFavorites}
                  disabled={favorites.some(c => c.id === cat.id)}
                  className="px-4 py-2 border-2 border-[#2d2d2d] rounded-lg font-medium hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all disabled:opacity-50"
                >
                  {favorites.some(c => c.id === cat.id) ? 'Saved!' : 'Save ❤️'}
                </button>
              </div>

              <p className="text-[#2d2d2d] mb-4">{cat.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#e8d5c4] rounded-lg p-3">
                  <p className="text-xs text-[#6b6b6b]">Temperament</p>
                  <p className="text-sm font-medium text-[#2d2d2d]">{cat.temperament}</p>
                </div>
                <div className="bg-[#e8d5c4] rounded-lg p-3">
                  <p className="text-xs text-[#6b6b6b]">Life Span</p>
                  <p className="text-sm font-medium text-[#2d2d2d]">{cat.life_span} years</p>
                </div>
              </div>

              <div className="space-y-2">
                <RatingBar label="Adaptability" value={cat.adaptability} />
                <RatingBar label="Affection" value={cat.affection_level} />
                <RatingBar label="Energy" value={cat.energy_level} />
                <RatingBar label="Intelligence" value={cat.intelligence} />
                <RatingBar label="Social" value={cat.social_needs} />
              </div>

              <div className="flex gap-2 mt-4">
                {cat.lap === 1 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Lap Cat</span>
                )}
                {cat.indoor === 1 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Indoor</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={fetchCat}
              disabled={loading}
              className="px-6 py-3 bg-[#2d2d2d] text-[#faf8f5] rounded-lg font-medium hover:bg-[#1a1a1a] transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Another Cat 🐱'}
            </button>
          </div>

          {favorites.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">Saved Cats</h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex-shrink-0 w-40 bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-lg overflow-hidden"
                  >
                    <img
                      src={fav.image}
                      alt={fav.name}
                      className="w-full h-32 object-cover"
                    />
                    <p className="p-2 text-sm font-medium text-[#2d2d2d] text-center">{fav.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
