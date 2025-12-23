import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { ProtectedRoute } from '../components/Auth/ProtectedRoute'
import { supabase } from '../lib/supabase'
import WinCard from '../components/Groups/WinCard'
import ShareWinModal from '../components/Groups/ShareWinModal'
import InviteMembers from '../components/Groups/InviteMembers'

function GroupDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, userProfile } = useAuth()
  const [group, setGroup] = useState(null)
  const [wins, setWins] = useState([])
  const [isMember, setIsMember] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    if (!userProfile?.has_golden_ticket) {
      navigate('/purchase')
      return
    }
    fetchGroup()
  }, [id, user, userProfile, navigate])

  const fetchGroup = async () => {
    if (!user?.id || !id) return

    try {
      // Get group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single()

      if (groupError) throw groupError
      setGroup(groupData)

      // Check if user is member
      const { data: memberData } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', id)
        .eq('user_id', user.id)
        .single()

      setIsMember(!!memberData)

      // Get wins if member
      if (memberData) {
        fetchWins()
      }
    } catch (error) {
      console.error('Error fetching group:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWins = async () => {
    try {
      const { data, error } = await supabase
        .from('wins')
        .select(`
          *,
          user:users(full_name, email)
        `)
        .eq('group_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWins(data || [])
    } catch (error) {
      console.error('Error fetching wins:', error)
    }
  }

  const handleJoin = async () => {
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: id,
          user_id: user.id,
          role: 'member',
        })

      if (error) throw error
      setIsMember(true)
      fetchWins()
    } catch (error) {
      console.error('Error joining group:', error)
      alert('Failed to join group')
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

  if (!group) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p className="font-mono text-xl text-gray-600">Group not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/groups')}
            className="font-mono text-sm text-gray-600 hover:text-gray-800 mb-4"
          >
            ← Back to Groups
          </button>
          <h1 className="font-mono text-4xl font-bold text-gray-900 mb-2">
            {group.name}
          </h1>
          {group.description && (
            <p className="font-mono text-xl text-gray-700 mb-4">
              {group.description}
            </p>
          )}
          <div className="flex gap-4">
            {!isMember ? (
              <button
                onClick={handleJoin}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg transition-colors"
              >
                Join Group
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg transition-colors"
                >
                  Share a Win
                </button>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-mono rounded-lg transition-colors"
                >
                  Invite Members
                </button>
              </>
            )}
          </div>
        </div>

        {isMember && (
          <div className="space-y-4">
            <h2 className="font-mono text-2xl font-bold text-gray-900">
              Recent Wins
            </h2>
            {wins.length === 0 ? (
              <div className="p-8 bg-gray-50 border-2 border-gray-300 rounded-lg text-center">
                <p className="font-mono text-lg text-gray-600">
                  No wins shared yet. Be the first to share a win!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {wins.map((win) => (
                  <WinCard key={win.id} win={win} />
                ))}
              </div>
            )}
          </div>
        )}

        {showShareModal && (
          <ShareWinModal
            groupId={id}
            onClose={() => {
              setShowShareModal(false)
              fetchWins()
            }}
          />
        )}

        {showInviteModal && (
          <InviteMembers
            group={group}
            onClose={() => setShowInviteModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default function GroupDetail() {
  return (
    <ProtectedRoute>
      <GroupDetailPage />
    </ProtectedRoute>
  )
}

