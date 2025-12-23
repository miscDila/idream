import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { ProtectedRoute } from '../components/Auth/ProtectedRoute'
import { supabase } from '../lib/supabase'

function GroupJoinPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, userProfile } = useAuth()
  const inviteCode = searchParams.get('code')
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userProfile?.has_golden_ticket) {
      navigate('/purchase')
      return
    }
    if (!inviteCode) {
      setError('No invite code provided')
      setLoading(false)
      return
    }
    fetchGroup()
  }, [inviteCode, userProfile, navigate])

  const fetchGroup = async () => {
    try {
      const { data, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', inviteCode)
        .single()

      if (groupError) throw groupError
      setGroup(data)

      // Check if already a member
      const { data: memberData } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', data.id)
        .eq('user_id', user.id)
        .single()

      if (memberData) {
        navigate(`/dashboard/groups/${data.id}`)
      }
    } catch (err) {
      setError('Invalid invite code')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!group || !user) return

    setJoining(true)
    setError('')

    try {
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'member',
        })

      if (joinError) throw joinError

      navigate(`/dashboard/groups/${group.id}`)
    } catch (err) {
      setError(err.message || 'Failed to join group')
      setJoining(false)
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

  if (error && !group) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6">
          <div className="relative p-12 bg-white rounded-lg shadow-xl border-2 border-gray-300 text-center">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h1 className="font-mono text-4xl font-bold text-gray-900 mb-4">
                Invalid Invite Code
              </h1>
              <p className="font-mono text-xl text-gray-700 mb-6">{error}</p>
              <button
                onClick={() => navigate('/dashboard/groups')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg"
              >
                Back to Groups
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="relative p-12 bg-white rounded-lg shadow-xl border-2 border-gray-300">
          <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
          
          <div className="relative z-10 text-center">
            <h1 className="font-mono text-4xl font-bold text-gray-900 mb-4">
              Join {group?.name}
            </h1>
            {group?.description && (
              <p className="font-mono text-xl text-gray-700 mb-6">
                {group.description}
              </p>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-3">
                <p className="font-mono text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              onClick={handleJoin}
              disabled={joining}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xl rounded-lg shadow-lg transition-all disabled:opacity-50"
            >
              {joining ? 'Joining...' : 'Join Group'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function GroupJoin() {
  return (
    <ProtectedRoute>
      <GroupJoinPage />
    </ProtectedRoute>
  )
}

