import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { ProtectedRoute } from '../components/Auth/ProtectedRoute'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import CreateGroupModal from '../components/Groups/CreateGroupModal'

function GroupsPage() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (!userProfile?.has_golden_ticket) {
      navigate('/purchase')
      return
    }
    fetchGroups()
  }, [user, userProfile, navigate])

  const fetchGroups = async () => {
    if (!user?.id) return

    try {
      // Get groups where user is a member
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          group:groups(*)
        `)
        .eq('user_id', user.id)

      if (error) throw error

      setGroups(data?.map((gm) => gm.group).filter(Boolean) || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-mono text-4xl font-bold text-gray-900 mb-2">
              Community Groups
            </h1>
            <p className="font-mono text-xl text-gray-700">
              Join groups and share your wins
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg transition-colors"
          >
            Create Group
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="relative p-12 bg-white rounded-lg shadow-lg border-2 border-gray-300 text-center">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <p className="font-mono text-xl text-gray-600 mb-6">
                You're not in any groups yet
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xl rounded-lg transition-colors"
              >
                Create Your First Group
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Link
                key={group.id}
                to={`/dashboard/groups/${group.id}`}
                className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300 hover:border-amber-400 transition-colors"
              >
                <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
                <div className="relative z-10">
                  <h3 className="font-mono text-2xl font-bold text-gray-900 mb-2">
                    {group.name}
                  </h3>
                  {group.description && (
                    <p className="font-mono text-sm text-gray-700 mb-4">
                      {group.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-600">
                      {group.is_private ? 'Private' : 'Public'}
                    </span>
                    <span className="font-mono text-sm text-amber-600">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateGroupModal
            onClose={() => {
              setShowCreateModal(false)
              fetchGroups()
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default function Groups() {
  return (
    <ProtectedRoute>
      <GroupsPage />
    </ProtectedRoute>
  )
}

