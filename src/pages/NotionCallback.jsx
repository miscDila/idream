import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function NotionCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const storedState = sessionStorage.getItem('notion_oauth_state')

    if (!code || !state || state !== storedState) {
      setError('Invalid callback parameters')
      navigate('/dashboard/notion')
      return
    }

    sessionStorage.removeItem('notion_oauth_state')

    try {
      // Exchange code for access token (this should be done server-side)
      // For now, we'll call an API endpoint
      const response = await fetch('/api/notion-oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to connect Notion')
      }

      navigate('/dashboard/notion?connected=true')
    } catch (err) {
      setError(err.message)
      setTimeout(() => navigate('/dashboard/notion'), 3000)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xl text-red-600 mb-4">{error}</p>
          <p className="font-mono text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="font-mono text-xl text-gray-600">Connecting Notion...</div>
    </div>
  )
}

