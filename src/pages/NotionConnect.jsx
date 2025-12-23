import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { ProtectedRoute } from '../components/Auth/ProtectedRoute'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function NotionConnectPage() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [connection, setConnection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userProfile?.has_golden_ticket) {
      navigate('/purchase')
      return
    }
    fetchConnection()
  }, [user, userProfile, navigate])

  const fetchConnection = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('notion_connections')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setConnection(data)
    } catch (error) {
      console.error('Error fetching connection:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = () => {
    // Redirect to Notion OAuth
    const notionClientId = import.meta.env.VITE_NOTION_CLIENT_ID
    const redirectUri = `${window.location.origin}/notion/callback`
    const state = crypto.randomUUID()

    // Store state in sessionStorage for verification
    sessionStorage.setItem('notion_oauth_state', state)

    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${notionClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&owner=user&state=${state}`
    
    window.location.href = authUrl
  }

  const handleDisconnect = async () => {
    if (!connection) return

    try {
      const { error } = await supabase
        .from('notion_connections')
        .delete()
        .eq('id', connection.id)

      if (error) throw error
      setConnection(null)
    } catch (error) {
      console.error('Error disconnecting:', error)
      alert('Failed to disconnect Notion')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="font-mono text-xl text-gray-600">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="font-mono text-4xl font-bold text-gray-900 mb-2">
            Notion Integration
          </h1>
          <p className="font-mono text-xl text-gray-700">
            Connect your Notion workspace to sync your vision board goals
          </p>
        </div>

        <div className="relative p-8 bg-white rounded-lg shadow-lg border-2 border-gray-300">
          <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
          
          <div className="relative z-10">
            {connection ? (
              <div>
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">✓</span>
                    <div>
                      <h2 className="font-mono text-2xl font-bold text-gray-900">
                        Connected to Notion
                      </h2>
                      <p className="font-mono text-sm text-gray-600">
                        Connected on {new Date(connection.connected_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/dashboard/notion/vision-board"
                    className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg transition-colors"
                  >
                    View Vision Board
                  </Link>
                  <button
                    onClick={handleDisconnect}
                    className="ml-4 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="font-mono text-2xl font-bold text-gray-900 mb-4">
                    Connect Your Notion Workspace
                  </h2>
                  <p className="font-mono text-lg text-gray-700 mb-4">
                    Sync your vision board goals and track your progress in Notion.
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-mono text-gray-700">
                    <li>Access your goals from anywhere</li>
                    <li>Track progress in real-time</li>
                    <li>Sync with your existing Notion databases</li>
                  </ul>
                </div>

                <button
                  onClick={handleConnect}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xl rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                  Connect Notion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function NotionConnect() {
  return (
    <ProtectedRoute>
      <NotionConnectPage />
    </ProtectedRoute>
  )
}

