import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function VisionBoardView() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGoals()
  }, [user])

  const fetchGoals = async () => {
    if (!user?.id) return

    try {
      // Get Notion connection
      const { data: connection, error: connError } = await supabase
        .from('notion_connections')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (connError || !connection) {
        throw new Error('Notion not connected')
      }

      // Fetch goals from Notion API
      // This would require a server-side API to use the access token securely
      const response = await fetch('/api/notion-goals', {
        headers: {
          'Authorization': `Bearer ${connection.notion_access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch goals')
      }

      const data = await response.json()
      setGoals(data.goals || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="font-mono text-xl text-gray-600">Loading goals...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-2 border-red-300 rounded-lg">
        <p className="font-mono text-red-800">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-2xl font-bold text-gray-900 mb-4">
        Your Vision Board Goals
      </h2>

      {goals.length === 0 ? (
        <div className="p-8 bg-gray-50 border-2 border-gray-300 rounded-lg text-center">
          <p className="font-mono text-lg text-gray-600">
            No goals found. Create some goals in your Notion database!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300"
            >
              <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
              <div className="relative z-10">
                <h3 className="font-mono text-xl font-bold text-gray-900 mb-2">
                  {goal.title}
                </h3>
                {goal.description && (
                  <p className="font-mono text-sm text-gray-700 mb-4">
                    {goal.description}
                  </p>
                )}
                {goal.status && (
                  <span className={`inline-block px-3 py-1 rounded font-mono text-sm ${
                    goal.status === 'Done' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {goal.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

